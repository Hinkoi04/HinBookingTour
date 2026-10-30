import { apiClient } from "../../../services/apiClient";

export function isDepartureUpcoming(departure) {
  if (!departure || !departure.startTime) return false;
  const start = new Date(departure.startTime);
  if (isNaN(start.getTime())) return false;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  if (start < todayStart) return false;
  const status = (departure.status || "").toLowerCase();
  if (status === "cancelled" || status === "completed" || status === "departed") return false;
  if (departure.deleted) return false;
  return true;
}

export function parseItineraryActivity(rawContent) {
  if (!rawContent) return [];

  // 1. Replace line break and block tags with newlines
  let formatted = String(rawContent)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h\d)\s*>/gi, "\n")
    .replace(/<\s*(p|div|li|h\d)[^>]*>/gi, "");

  // 2. Insert newlines before session markers like Sáng:, Trưa:, Chiều:, Tối:
  formatted = formatted.replace(
    /(?:^|\s)(?:<[^>]+>)?(Sáng|Trưa|Trua|Chiều|Tối|Toi|Đêm|Dem|Buổi sáng|Buổi trưa|Buổi chiều|Buổi tối|Khởi hành|Ngày mới)\s*:(?:<\/[^>]+>)?/gi,
    (m, session) => `\n${session}: `
  );

  // 3. Split into lines and clean tags & decode HTML entities
  const lines = formatted
    .split("\n")
    .map((line) => {
      let clean = line.replace(/<[^>]+>/g, "").trim();
      if (typeof DOMParser !== "undefined") {
        try {
          const doc = new DOMParser().parseFromString(clean, "text/html");
          clean = doc.body.textContent || clean;
        } catch {
          // fallback
        }
      }
      return clean.trim();
    })
    .filter(Boolean);

  const items = [];
  const sessionRegex = /^(Sáng|Trưa|Trua|Chiều|Tối|Toi|Đêm|Dem|Buổi sáng|Buổi trưa|Buổi chiều|Buổi tối|Khởi hành|Ngày mới)\s*:(.*)$/i;

  for (const line of lines) {
    const match = line.match(sessionRegex);
    if (match) {
      let tag = match[1].trim();
      if (tag.toLowerCase() === "trua") tag = "Trưa";
      if (tag.toLowerCase() === "toi") tag = "Tối";
      if (tag.toLowerCase() === "dem") tag = "Đêm";
      tag = tag.charAt(0).toUpperCase() + tag.slice(1);

      items.push({
        timeTag: tag,
        text: match[2].trim(),
      });
    } else {
      if (items.length > 0 && items[items.length - 1].timeTag && !items[items.length - 1].text) {
        items[items.length - 1].text = line;
      } else {
        items.push({
          timeTag: null,
          text: line,
        });
      }
    }
  }

  return items.length > 0 ? items : [{ timeTag: null, text: String(rawContent).replace(/<[^>]+>/g, "").trim() }];
}

export function mapTour(tour, categories = [], departures = []) {
  if (!tour) return null;

  const allTourDepartures = Array.isArray(departures)
    ? departures.filter(
        (d) =>
          d.tourId === tour.id ||
          (d.tourId && typeof d.tourId === "object" && d.tourId.id === tour.id) ||
          d.tourId === Number(tour.id)
      )
    : [];

  // Chỉ lấy những đợt khởi hành chưa khởi hành (từ hôm nay trở đi)
  const tourDepartures = allTourDepartures
    .filter(isDepartureUpcoming)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const matchedCat = Array.isArray(categories)
    ? categories.find((c) => c.id === tour.categoryId || c.id === Number(tour.categoryId))
    : null;

  const categoryName =
    matchedCat?.title ||
    matchedCat?.name ||
    tour.category ||
    "Tour Du Lịch";

  let lowestPrice = 0;
  let highestDiscount = 0;
  let departureLocations = [];

  const activeDeps = tourDepartures.length > 0 ? tourDepartures : allTourDepartures;
  if (activeDeps.length > 0) {
    const prices = activeDeps
      .map((d) => Number(d.priceAdult) || 0)
      .filter((p) => p > 0);
    if (prices.length > 0) {
      lowestPrice = Math.min(...prices);
    }
    const discounts = activeDeps
      .map((d) => Number(d.discount) || 0)
      .filter((disc) => disc > 0);
    if (discounts.length > 0) {
      highestDiscount = Math.max(...discounts);
    }
    departureLocations = [
      ...new Set(activeDeps.map((d) => d.departureFrom).filter(Boolean)),
    ];
  }

  if (!lowestPrice && tour.price) {
    lowestPrice = Number(tour.price);
  }

  const discount = highestDiscount || tour.discount || 0;
  const originalPrice =
    discount > 0 && lowestPrice > 0
      ? Math.round(lowestPrice / (1 - discount / 100))
      : tour.originalPrice || null;

  const defaultImg =
    tour.thumbnail ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

  const rawImages = Array.isArray(tour.images) ? tour.images.filter(Boolean) : [];
  const allImages = [
    defaultImg,
    ...rawImages.filter((img) => img && img !== defaultImg),
  ];

  const catLower = (categoryName || "").toLowerCase();
  const isInternational =
    catLower.includes("quốc tế") ||
    catLower.includes("châu") ||
    catLower.includes("ngoài nước") ||
    catLower.includes("đông nam á") ||
    catLower.includes("đông bắc á");

  const rawSchedules = Array.isArray(tour.schedules) ? [...tour.schedules] : [];
  rawSchedules.sort((a, b) => (Number(a.dayNumber) || 0) - (Number(b.dayNumber) || 0));

  const itinerary = rawSchedules.length > 0
    ? rawSchedules.map((s, idx) => {
        let cleanTitle = (s.title || `Ngày ${s.dayNumber || idx + 1}`).replace(/<[^>]+>/g, "").trim();
        if (typeof DOMParser !== "undefined") {
          try {
            const doc = new DOMParser().parseFromString(cleanTitle, "text/html");
            cleanTitle = doc.body.textContent || cleanTitle;
          } catch {}
        }
        return {
          day: s.dayNumber || idx + 1,
          title: cleanTitle,
          rawContent: s.content || s.description || "",
          activities: parseItineraryActivity(s.content || s.description || "Khám phá các điểm đến hấp dẫn theo lịch trình."),
        };
      })
    : [];

  return {
    id: tour.id,
    slug: tour.slug,
    name: tour.title || tour.name || "Tour Du Lịch",
    category: categoryName,
    categoryId: tour.categoryId,
    type: isInternational ? "international" : "domestic",
    duration: tour.time || tour.duration || "3 ngày 2 đêm",
    location: departureLocations[0] || tour.location || "Việt Nam",
    departureFrom: departureLocations.join(", ") || tour.departureFrom || "Hà Nội / TP.HCM",
    price: lowestPrice || 2990000,
    originalPrice: originalPrice,
    discount: discount,
    rating: tour.rating || 5,
    reviewCount: tour.reviewCount || 0,
    maxPeople: tour.maxPeople || 25,
    image: defaultImg,
    images: allImages.length > 0 ? allImages : [defaultImg],
    description: tour.description || "",
    highlights: tour.highlights || [
      "Khám phá cảnh quan thiên nhiên tuyệt đẹp",
      "Khách sạn tiêu chuẩn cao cấp, tiện nghi",
      "Thưởng thức ẩm thực đặc sắc địa phương",
      "Hướng dẫn viên chuyên nghiệp, tận tâm suốt hành trình",
    ],
    includes: tour.includes || [
      "Xe máy lạnh chất lượng cao đưa đón suốt tuyến",
      "Phòng khách sạn theo tiêu chuẩn chương trình",
      "Các bữa ăn theo lịch trình đã thông báo",
      "Vé tham quan các điểm du lịch trong tour",
      "Bảo hiểm du lịch mức bồi thường cao",
    ],
    excludes: tour.excludes || [
      "Chi phí cá nhân ngoài chương trình",
      "Đồ uống gọi thêm trong các bữa ăn",
      "Tiền tip cho hướng dẫn viên và tài xế",
      "Thuế VAT",
    ],
    itinerary: itinerary,
    departures: tourDepartures,
    allDepartures: allTourDepartures,
    tourCode: tour.code || tour.tourCode || `${600000 + Number(tour.id)}`,
    vehicle: tourDepartures[0]?.vehicleName || (isInternational ? "Máy bay Vietnam Airlines" : "Xe Limousine 24 chỗ"),
    departureDate: tourDepartures[0]?.startTime ? tourDepartures[0].startTime.split("T")[0] : "",
    departureLocation: tourDepartures[0]?.departureFrom || departureLocations[0] || tour.departureFrom || "Hồ Chí Minh",
    availableSlots: tourDepartures[0]?.stockAdult !== undefined ? tourDepartures[0].stockAdult : (tour.maxPeople || 40),
  };
}

export function getFlashSaleItems(allTours = []) {
  if (!Array.isArray(allTours) || allTours.length === 0) return [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const in30Days = new Date(todayStart.getTime() + 30 * 24 * 60 * 60 * 1000 + 86399999);

  const flashItems = [];

  for (const tour of allTours) {
    if (!Array.isArray(tour.departures)) continue;

    for (const dep of tour.departures) {
      const discount = Number(dep.discount) || 0;
      if (discount <= 0) continue;

      if (!dep.startTime) continue;
      const depDate = new Date(dep.startTime);
      if (isNaN(depDate.getTime())) continue;

      // Check if departure date is within today to 30 days from now
      if (depDate >= todayStart && depDate <= in30Days) {
        const salePrice = Number(dep.priceAdult) || tour.price;
        const originalPrice =
          discount > 0 && salePrice > 0
            ? Math.round(salePrice / (1 - discount / 100))
            : tour.originalPrice;

        flashItems.push({
          id: tour.id,
          slug: tour.slug,
          departureId: dep.id,
          name: tour.name,
          image: tour.image,
          discount: discount,
          price: salePrice,
          originalPrice: originalPrice,
          departureTime: dep.startTime,
          departureFrom: dep.departureFrom || tour.departureFrom,
          stock: dep.stockAdult,
          duration: tour.duration,
          location: tour.location,
          rating: tour.rating,
          tourCode: tour.tourCode,
          vehicle: dep.vehicleName || tour.vehicle,
          type: tour.type,
        });
      }
    }
  }

  // Sắp xếp giảm giá giảm dần
  flashItems.sort((a, b) => b.discount - a.discount);

  return flashItems;
}

export const homeService = {
  getFlashSaleItems,
  getAllTours: async () => {
    try {
      const [toursRes, catRes, depRes] = await Promise.allSettled([
        apiClient.get("/tour"),
        apiClient.get("/category"),
        apiClient.get("/departure"),
      ]);

      const rawTours = toursRes.status === "fulfilled" ? toursRes.value.data : [];
      const categories = catRes.status === "fulfilled" ? catRes.value.data : [];
      const departures = depRes.status === "fulfilled" ? depRes.value.data : [];

      if (Array.isArray(rawTours)) {
        return rawTours.map((t) => mapTour(t, categories, departures)).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải danh sách tour trang chủ:", error);
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await apiClient.get("/category");
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      return [];
    }
  },

  getBlogs: async () => {
    try {
      const res = await apiClient.get("/blogs");
      if (Array.isArray(res.data)) {
        return res.data.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title || "",
          image:
            b.thumbnail ||
            "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
          category: "Cẩm nang",
          date: b.createdAt ? b.createdAt.split("T")[0] : "",
          readTime: 5,
          author: "TravelGo Team",
          excerpt: b.description || b.content?.slice(0, 150) || "",
          content: b.content || "",
        }));
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      return [];
    }
  },

  sendContact: async (data) => {
    const res = await apiClient.post("/contacts", data);
    return res.data;
  },
};
