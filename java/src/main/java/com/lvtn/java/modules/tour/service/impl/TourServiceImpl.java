package com.lvtn.java.modules.tour.service.impl;

import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.tour.entity.TourImage;
import com.lvtn.java.dto.tour.TourCreateRequest;
import com.lvtn.java.dto.tour.TourResponse;
import com.lvtn.java.modules.tripDetails.repository.DepartureRepository;
import com.lvtn.java.modules.tour.repository.TourImageRepository;
import com.lvtn.java.modules.tour.repository.TourRepository;
import com.lvtn.java.modules.tripDetails.service.ScheduleService;
import com.lvtn.java.modules.tour.service.TourService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final DepartureRepository departureRepository;
    private final ScheduleService scheduleService;
    private final TourImageRepository tourImageRepository;
    private final ModelMapper mapper;

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return "";
        }
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("").toLowerCase();
        slug = slug.replaceAll("[^a-z0-9\\-]", "-");
        slug = slug.replaceAll("-+", "-");
        slug = slug.replaceAll("^-|-$", "");

        return slug;
    }

    private TourResponse mapToResponse(Tour tour) {
        TourResponse response = mapper.map(tour, TourResponse.class);
        response.setSchedules(scheduleService.getSchedulesByTourId(tour.getId()));

        List<String> galleryUrls = tourImageRepository.findByTourIdAndDeletedFalse(tour.getId())
                .stream()
                .map(TourImage::getImageUrl)
                .collect(Collectors.toList());
        response.setImages(galleryUrls);

        return response;
    }

    @Override
    @Transactional
    public TourResponse createTour(TourCreateRequest request, String imageUrl, List<String> galleryUrls, Integer creatorId) {
        String baseSlug = generateSlug(request.getTitle());
        String slug = baseSlug;

        if (tourRepository.existsBySlugIncludingDeleted(slug)) {
            slug = baseSlug + "-" + System.currentTimeMillis();
        }

        Tour tour = mapper.map(request, Tour.class);
        tour.setSlug(slug);

        if (imageUrl != null && !imageUrl.isBlank()) {
            tour.setThumbnail(imageUrl);
        }

        if (tour.getStatus() == null) {
            tour.setStatus("active");
        }

        tour.setCreatedBy(creatorId);
        tour.setUpdatedBy(creatorId);

        Tour savedTour = tourRepository.save(tour);

        if (galleryUrls != null && !galleryUrls.isEmpty()) {
            List<TourImage> tourImages = galleryUrls.stream().map(url -> {
                TourImage img = TourImage.builder()
                        .tourId(savedTour.getId())
                        .imageUrl(url)
                        .build();
                img.setCreatedBy(creatorId);
                img.setUpdatedBy(creatorId);
                return img;
            }).collect(Collectors.toList());
            tourImageRepository.saveAll(tourImages);
        }

        return mapToResponse(savedTour);
    }

    @Override
    public TourResponse getTourById(Integer id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));

        return mapToResponse(tour);
    }

    @Override
    public List<TourResponse> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TourResponse updateTour(
            Integer id,
            TourCreateRequest request,
            String imageUrl,
            List<String> galleryUrls,
            List<String> existingImageUrls,
            Integer updaterId) {

        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));

        mapper.typeMap(TourCreateRequest.class, Tour.class)
                .addMappings(m -> {
                    m.skip(Tour::setCreatedBy);
                    m.skip(Tour::setUpdatedBy);
                    m.skip(Tour::setDeletedBy);
                });
        mapper.map(request, existingTour);

        if (imageUrl != null && !imageUrl.isBlank()) {
            existingTour.setThumbnail(imageUrl);
        }

        existingTour.setUpdatedBy(updaterId);
        Tour updatedTour = tourRepository.save(existingTour);
        List<TourImage> currentImages = tourImageRepository
                .findByTourIdAndDeletedFalse(updatedTour.getId());
        List<String> keepUrls = (existingImageUrls != null) ? existingImageUrls : List.of();
        List<TourImage> toDelete = currentImages.stream()
                .filter(img -> !keepUrls.contains(img.getImageUrl()))
                .collect(Collectors.toList());

        toDelete.forEach(img -> {
            img.setDeleted(true);
            img.setDeletedBy(updaterId);
            img.setDeletedAt(java.time.LocalDateTime.now());
        });
        if (!toDelete.isEmpty()) {
            tourImageRepository.saveAll(toDelete);
        }
        if (galleryUrls != null && !galleryUrls.isEmpty()) {
            List<TourImage> newImages = galleryUrls.stream().map(url -> {
                TourImage img = TourImage.builder()
                        .tourId(updatedTour.getId())
                        .imageUrl(url)
                        .build();
                img.setCreatedBy(updaterId);
                img.setUpdatedBy(updaterId);
                return img;
            }).collect(Collectors.toList());
            tourImageRepository.saveAll(newImages);
        }

        return mapToResponse(updatedTour);
    }

    @Override
    @Transactional
    public void deleteTour(Integer id, Integer deleterId) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour với ID: " + id));

        int departureCount = departureRepository.countDeparturesByTourId(id);

        if (departureCount > 0) {
            throw new RuntimeException("Không thể chuyển vào thùng rác! Tour này đang có " + departureCount + " lịch khởi hành hoạt động.");
        }

        tour.setDeleted(true);
        tour.setDeletedAt(LocalDateTime.now());
        tour.setDeletedBy(deleterId);

        tourRepository.save(tour);
    }

    @Override
    public List<TourResponse> findAllActive() {
        return tourRepository.findAllActiveTours().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TourResponse> findAllTrash() {
        return tourRepository.findAllTrashTours().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void restore(Integer id, Integer restorerId) {
        tourRepository.restoreTourNative(id, restorerId);
    }

    @Override
    @Transactional
    public void hardDelete(Integer id) {
        departureRepository.hardDeleteDeparturesByTourId(id);
        tourRepository.hardDeleteTourNative(id);
    }
}