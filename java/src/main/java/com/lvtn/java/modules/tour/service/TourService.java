package com.lvtn.java.modules.tour.service;

import com.lvtn.java.dto.tour.TourCreateRequest;
import com.lvtn.java.dto.tour.TourResponse;

import java.util.List;

public interface TourService {
    TourResponse createTour(TourCreateRequest request, String imageUrl, List<String> galleryUrls, Integer creatorId);
    TourResponse getTourById(Integer id);
    List<TourResponse> getAllTours();
    TourResponse updateTour(Integer id, TourCreateRequest request, String imageUrl, List<String> galleryUrls,List<String> existingImageUrls,Integer updaterId);
    void deleteTour(Integer id, Integer deleterId);
    List<TourResponse> findAllActive();
    List<TourResponse> findAllTrash();
    void restore(Integer id, Integer restorerId);
    void hardDelete(Integer id);
}