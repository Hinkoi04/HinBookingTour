import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock, MapPin, ArrowRight, Search, Calendar, ChevronRight,
  Send, Phone, Mail, CheckCircle, Filter, X, Plane, Flame, ChevronLeft,
  Trophy, CircleDollarSign, ShieldCheck, Star, LockKeyhole
} from "lucide-react";
import { homeService } from "../services/homeService";
import { TourCard, FlashSaleCard, TourSkeleton } from "../components";
import { toast } from "sonner";

function getFlashSaleVisibleCount() {
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function useCountdownToMidnight() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const secondsLeft = Math.max(0, Math.floor((midnight.getTime() - now) / 1000));

  return {
    hours: String(Math.floor(secondsLeft / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0"),
    seconds: String(secondsLeft % 60).padStart(2, "0"),
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [flashSaleIndex, setFlashSaleIndex] = useState(0);
  const [flashSaleVisibleCount, setFlashSaleVisibleCount] = useState(getFlashSaleVisibleCount);
  const [flashSaleTransitionEnabled, setFlashSaleTransitionEnabled] = useState(true);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [categoryVisibleCount, setCategoryVisibleCount] = useState(getFlashSaleVisibleCount);
  const [categoryTransitionEnabled, setCategoryTransitionEnabled] = useState(true);
  const [visibleDomesticTourCount, setVisibleDomesticTourCount] = useState(8);
  const [visibleInternationalTourCount, setVisibleInternationalTourCount] = useState(8);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const selectedDate = searchParams.get("date") || "";
  const selectedCategory = searchParams.get("category") || "";

  const countdown = useCountdownToMidnight();
  const [search, setSearch] = useState(searchQuery);
  const [searchDate, setSearchDate] = useState(selectedDate);
  const [contactEmail, setContactEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [allTours, setAllTours] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setSearchDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [toursData, catsData, blogsData] = await Promise.all([
          homeService.getAllTours(),
          homeService.getCategories(),
          homeService.getBlogs(),
        ]);
        if (isMounted) {
          setAllTours(toursData);
          setCategoriesList(catsData);
          setBlogsList(blogsData);
        }
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    if (!search.trim() && !searchDate) {
      toast.error("Vui lòng nhập điểm đến hoặc chọn ngày khởi hành");
      return;
    }
    const params = {};
    if (search.trim()) params.q = search.trim();
    if (searchDate) params.date = searchDate;
    setSearchParams(params);
    const resultsEl = document.getElementById("search-results");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearFilter = () => {
    setSearch("");
    setSearchParams({});
  };

  const handleContact = async (e) => {
    e?.preventDefault();
    if (!contactEmail.trim()) {
      toast.error("Vui lòng nhập địa chỉ email của bạn");
      return;
    }
    setContactLoading(true);
    try {
      await homeService.sendContact({ email: contactEmail.trim(), message: "Đăng ký nhận tin & tư vấn tour từ TravelGo" });
      setContactSent(true);
      setContactEmail("");
      toast.success("Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ gửi ưu đãi sớm nhất.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Không thể gửi thông tin. Vui lòng thử lại."
      );
    } finally {
      setContactLoading(false);
    }
  };

  const flashSaleItems = homeService.getFlashSaleItems(allTours);
  const flashSaleCarouselItems = flashSaleItems.length > 0
    ? [...flashSaleItems, ...flashSaleItems, ...flashSaleItems]
    : [];
  const flashSaleTrackWidth = flashSaleCarouselItems.length > 0
    ? `${(flashSaleCarouselItems.length / flashSaleVisibleCount) * 100}%`
    : "100%";
  const flashSaleSlideWidth = flashSaleCarouselItems.length > 0
    ? `${100 / flashSaleCarouselItems.length}%`
    : "100%";
  const domesticTours = allTours.filter((t) => t.type === "domestic");
  const internationalTours = allTours.filter((t) => t.type === "international");
  const domesticToursToShow = domesticTours.length > 0 ? domesticTours : allTours;
  const internationalToursToShow = internationalTours.length > 0 ? internationalTours : allTours.slice(4);

  useEffect(() => {
    const updateVisibleCount = () => setFlashSaleVisibleCount(getFlashSaleVisibleCount());
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => setCategoryVisibleCount(getFlashSaleVisibleCount());
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    setFlashSaleTransitionEnabled(false);
    setFlashSaleIndex(flashSaleItems.length);
    const frame = requestAnimationFrame(() => setFlashSaleTransitionEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, [flashSaleItems.length]);

  useEffect(() => {
    if (flashSaleItems.length < 2) return undefined;
    const interval = setInterval(() => {
      setFlashSaleIndex((index) => index + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [flashSaleItems.length]);

  const handleFlashSaleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    const itemCount = flashSaleItems.length;
    if (itemCount === 0 || (flashSaleIndex >= itemCount && flashSaleIndex < itemCount * 2)) return;

    setFlashSaleTransitionEnabled(false);
    setFlashSaleIndex((index) => index >= itemCount * 2 ? index - itemCount : index + itemCount);
    requestAnimationFrame(() => setFlashSaleTransitionEnabled(true));
  };

  const moveFlashSale = (direction) => {
    if (flashSaleItems.length < 2) return;
    setFlashSaleIndex((index) => index + direction);
  };

  const fallbackCategoryCards = [
    { label: "Tour Miền Bắc", desc: "Hạ Long, Sapa, Hà Nội", img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" },
    { label: "Tour Miền Nam", desc: "Phú Quốc, Mũi Né, Cần Thơ", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80" },
    { label: "Tour Miền Trung", desc: "Đà Nẵng, Hội An, Huế", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80" },
    { label: "Tour Quốc tế", desc: "Nhật, Thái, Hàn, Châu Âu", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
  ];
  const categoryCards = categoriesList.length > 0
    ? categoriesList.map((category, index) => {
        const label = category.title || category.name || `Danh mục ${index + 1}`;
        const fallback = fallbackCategoryCards.find((item) =>
          label.toLowerCase().includes(item.label.toLowerCase().replace("tour ", ""))
        );
        return {
          label,
          desc: category.description || fallback?.desc || "Khám phá những hành trình hấp dẫn",
          img: category.thumbnail || fallback?.img || fallbackCategoryCards[index % fallbackCategoryCards.length].img,
          count: Number(category.tourCount) || 0,
        };
      })
    : fallbackCategoryCards.map((category) => {
        const count = allTours.filter(
          (tour) =>
            (tour.category || "").toLowerCase().includes(category.label.toLowerCase().replace("tour ", "")) ||
            (category.label === "Tour Quốc tế" && tour.type === "international")
        ).length;
        return {
          ...category,
          count: count > 0 ? count : (allTours.length > 0 ? Math.ceil(allTours.length / 4) : 10),
        };
      });

  const categoryCarouselItems = categoryCards.length > 0
    ? [...categoryCards, ...categoryCards, ...categoryCards]
    : [];
  const categoryTrackWidth = categoryCarouselItems.length > 0
    ? `${(categoryCarouselItems.length / categoryVisibleCount) * 100}%`
    : "100%";
  const categorySlideWidth = categoryCarouselItems.length > 0
    ? `${100 / categoryCarouselItems.length}%`
    : "100%";

  useEffect(() => {
    setCategoryTransitionEnabled(false);
    setCategoryIndex(categoryCards.length);
    const frame = requestAnimationFrame(() => setCategoryTransitionEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, [categoryCards.length]);

  useEffect(() => {
    if (categoryCards.length <= categoryVisibleCount) return undefined;
    const interval = setInterval(() => {
      setCategoryIndex((index) => index + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [categoryCards.length, categoryVisibleCount]);

  const handleCategoryTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    const itemCount = categoryCards.length;
    if (itemCount === 0 || (categoryIndex >= itemCount && categoryIndex < itemCount * 2)) return;

    setCategoryTransitionEnabled(false);
    setCategoryIndex((index) => index >= itemCount * 2 ? index - itemCount : index + itemCount);
    requestAnimationFrame(() => setCategoryTransitionEnabled(true));
  };

  const moveCategory = (direction) => {
    if (categoryCards.length <= categoryVisibleCount) return;
    setCategoryIndex((index) => index + direction);
  };

  const filteredTours = (searchQuery || selectedCategory || selectedDate)
    ? allTours.filter((t) => {
        const q = (searchQuery || "").toLowerCase();
        const matchQuery = searchQuery
          ? (t.name || "").toLowerCase().includes(q) ||
            (t.location || "").toLowerCase().includes(q) ||
            (t.category || "").toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
          : true;
        const matchCategory = selectedCategory
          ? (t.category || "").toLowerCase().includes(selectedCategory.toLowerCase().replace("tour ", "")) ||
            (selectedCategory === "Tour Quốc tế" && t.type === "international")
          : true;
        const matchDate = selectedDate
          ? t.departures?.some((departure) => departure.startTime?.slice(0, 10) === selectedDate)
          : true;
        return matchQuery && matchCategory && matchDate;
      })
    : [];

  useEffect(() => {
    const revealItems = pageRef.current?.querySelectorAll(".home-reveal:not(.is-visible)");
    if (!revealItems?.length) return undefined;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [
    loading,
    allTours.length,
    blogsList.length,
    filteredTours.length,
    flashSaleItems.length,
    categoryCards.length,
    visibleDomesticTourCount,
    visibleInternationalTourCount,
    searchQuery,
    selectedCategory,
    selectedDate,
  ]);

  return (
    <div ref={pageRef} className="home-page">
      {/* Hero Banner */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Hero"
          className="home-hero-image absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/75 to-blue-950/80" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full flex flex-col items-center justify-center text-center">
          <span className="home-reveal inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md text-blue-200 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full border border-blue-400/30 mb-6 shadow-sm" data-home-reveal-delay="1">
            <Plane className="w-4 h-4" aria-hidden="true" /> Khám phá thế giới cùng TravelGo
          </span>

          <h1 className="home-reveal text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight" data-home-reveal-delay="2">
            Hành Trình <span className="text-yellow-400 drop-shadow-md">Đáng Nhớ</span> Của Bạn
          </h1>

          <p className="home-reveal text-base sm:text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto font-medium" data-home-reveal-delay="3">
            Khám phá hơn 500+ tour du lịch trong nước và quốc tế với giá ưu đãi nhất. Đặt chỗ linh hoạt, dịch vụ tận tâm 24/7.
          </p>

          {/* Search box */}
          <div className="home-reveal w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/40" data-home-reveal-delay="4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu? (Hạ Long, Đà Nẵng, Tokyo...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-left transition-all"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
              >
                <Search className="w-4 h-4" /> Tìm kiếm tour
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="home-reveal flex flex-wrap justify-center gap-8 sm:gap-16 mt-12 pt-8 border-t border-white/10 w-full max-w-3xl" data-home-reveal-delay="5">
            {[
              { num: allTours.length > 0 ? `${allTours.length}+` : "500+", label: "Tour du lịch" },
              { num: "50K+", label: "Khách hàng" },
              { num: "98%", label: "Hài lòng" },
              { num: "24/7", label: "Hỗ trợ tận tâm" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-yellow-400">{s.num}</p>
                <p className="text-xs sm:text-sm text-blue-200 font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtered Search Results Section */}
      {(searchQuery || selectedCategory || selectedDate) && (
        <section id="search-results" className="py-14 bg-blue-50/50 border-b border-blue-100">
          <div className="home-reveal max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
                  <Filter className="w-4 h-4" /> KẾT QUẢ TÌM KIẾM
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Tìm thấy {filteredTours.length} tour phù hợp
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {searchQuery && `Từ khóa: "${searchQuery}"`} {selectedCategory && `Danh mục: "${selectedCategory}"`}
                </span>
                <button
                  onClick={clearFilter}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Xóa bộ lọc
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <TourSkeleton key={i} />
                ))}
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-lg mx-auto">
                <Search className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Không tìm thấy tour phù hợp</h3>
                <p className="text-sm text-gray-500 mb-6">Hãy thử tìm kiếm với từ khóa khác như "Hạ Long", "Đà Nẵng", "Nhật Bản"...</p>
                <button
                  onClick={clearFilter}
                  className="bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Xem tất cả tour
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Flash Sale (Chỉ hiển thị khi có lịch khởi hành giảm giá trong 30 ngày tới) */}
      {!loading && flashSaleItems.length > 0 && (
        <section id="flash-sale" className="py-16 bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 shadow-inner">
          <div className="home-reveal max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 bg-white/20 rounded-xl">
                    <Flame className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <h2 className="text-3xl font-black text-white">Flash Sale Giờ Vàng</h2>
                </div>
                <p className="text-red-100 text-sm sm:text-base">
                  Ưu đãi giảm sốc trong 30 ngày tới ({flashSaleItems.length} chuyến) – Đặt ngay kẻo lỡ!
                </p>
              </div>
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <p className="text-white/90 text-xs sm:text-sm font-bold">Kết thúc ngày trong:</p>
              {[countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => (
                <span key={index} className="flex items-center">
                  <span className="bg-white text-red-600 text-lg sm:text-xl font-black px-2.5 py-1.5 rounded-xl min-w-[2.5rem] text-center inline-block shadow">
                    {value}
                  </span>
                  {index < 2 && <span className="text-white font-black text-lg mx-0.5">:</span>}
                </span>
              ))}
              </div>
            </div>

            <div className="relative px-10 sm:px-12">
              {flashSaleItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => moveFlashSale(-1)}
                  aria-label="Xem tour Flash Sale trước"
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-red-600 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => moveFlashSale(1)}
                  aria-label="Xem tour Flash Sale tiếp theo"
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-red-600 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
              )}
              <div className="overflow-hidden">
              <div
                className="flex"
                onTransitionEnd={handleFlashSaleTransitionEnd}
                style={{
                  width: flashSaleTrackWidth,
                  transform: `translateX(-${(flashSaleIndex * 100) / (flashSaleCarouselItems.length || 1)}%)`,
                  transition: flashSaleTransitionEnabled ? "transform 500ms ease-in-out" : "none",
                }}
              >
                {flashSaleCarouselItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.departureId || item.departureTime}-${index}`}
                    className="min-w-0 px-2"
                    style={{ flex: `0 0 ${flashSaleSlideWidth}` }}
                  >
                    <FlashSaleCard item={item} />
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">DANH MỤC TOUR</p>
            <h2 className="text-3xl font-black text-gray-900">Khám Phá Theo Sở Thích</h2>
          </div>
          <div className="relative">
            {categoryCards.length > categoryVisibleCount && (
              <>
                <button
                  type="button"
                  onClick={() => moveCategory(-1)}
                  aria-label="Xem danh mục tour trước"
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-blue-600 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(1)}
                  aria-label="Xem danh mục tour tiếp theo"
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-blue-600 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
            )}
            <div className="overflow-hidden">
              <div
                className="flex"
                onTransitionEnd={handleCategoryTransitionEnd}
                style={{
                  width: categoryTrackWidth,
                  transform: `translateX(-${(categoryIndex * 100) / (categoryCarouselItems.length || 1)}%)`,
                  transition: categoryTransitionEnabled ? "transform 500ms ease-in-out" : "none",
                }}
              >
                {categoryCarouselItems.map((cat, index) => (
              <div
                key={`${cat.label}-${index}`}
                onClick={() => setSearchParams({ category: cat.label })}
                className="home-reveal relative h-56 min-w-0 px-2"
                data-home-reveal-delay={index}
                style={{ flex: `0 0 ${categorySlideWidth}` }}
              >
                <div className="relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-base">{cat.label}</p>
                    <p className="text-white/70 text-xs mt-0.5">{cat.desc}</p>
                    <span className="inline-block mt-2 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {cat.count} tour
                    </span>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domestic tours */}
      <section id="domestic" className="py-16 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-[#4300d1] mb-2 tracking-tight">
              Khám Phá Tour Trong Nước
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Trải nghiệm cảnh sắc tuyệt mỹ khắp mọi miền đất nước cùng TravelGo
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <TourSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {domesticToursToShow.slice(0, visibleDomesticTourCount).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
          {!loading && visibleDomesticTourCount < domesticToursToShow.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleDomesticTourCount((count) => count + 8)}
                className="inline-flex items-center rounded-xl border border-blue-600 bg-transparent px-6 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </section>

      {/* International tours */}
      <section id="international" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-purple-700 mb-2 tracking-tight">
              Khám Phá Tour Quốc Tế
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Chạm tới những chân trời mới với các hành trình xuất ngoại đẳng cấp
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <TourSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {internationalToursToShow.slice(0, visibleInternationalTourCount).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
          {!loading && visibleInternationalTourCount < internationalToursToShow.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleInternationalTourCount((count) => count + 8)}
                className="inline-flex items-center rounded-xl border border-purple-600 bg-transparent px-6 py-3 text-sm font-bold text-purple-600 shadow-sm transition hover:bg-purple-50"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3">Tại Sao Chọn TravelGo?</h2>
            <p className="text-blue-200">Chúng tôi cam kết mang đến trải nghiệm du lịch an toàn, trọn vẹn và đáng nhớ nhất</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Trophy, title: "10 Năm Kinh Nghiệm", desc: "Đội ngũ chuyên nghiệp với hàng nghìn hành trình hoàn hảo" },
              { icon: CircleDollarSign, title: "Giá Tốt Nhất", desc: "Cam kết giá cạnh tranh, chính sách hoàn tiền minh bạch" },
              { icon: ShieldCheck, title: "An Toàn - Uy Tín", desc: "Bảo hiểm toàn diện, hỗ trợ 24/7 trong suốt chuyến đi" },
              { icon: Star, title: "98% Hài Lòng", desc: "Khách hàng luôn tin tưởng và tiếp tục lựa chọn đồng hành" },
            ].map((item, index) => (
              <div key={item.title} className="home-reveal text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors" data-home-reveal-delay={index}>
                <item.icon className="w-12 h-12 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section id="blogs" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">CẨM NANG DU LỊCH</p>
              <h2 className="text-3xl font-black text-gray-900">Bài Viết Mới Nhất</h2>
            </div>
            <Link to="/cam-nang" className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="loading-skeleton bg-white rounded-2xl h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogsList.slice(0, 3).map((blog, index) => (
                <Link to={`/cam-nang/${encodeURIComponent(blog.slug || blog.id)}`} key={blog.id} className="home-reveal bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group block border border-gray-100" data-home-reveal-delay={index}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80";
                      }}
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      {blog.category || "Cẩm nang"}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>{blog.date ? new Date(blog.date).toLocaleDateString("vi-VN") : ""}</span>
                      <span>•</span>
                      <span>{blog.readTime || 5} phút đọc</span>
                      <span>•</span>
                      <span>{blog.author || "TravelGo Team"}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-bold">
                      Đọc tiếp <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">HỖ TRỢ KHÁCH HÀNG</p>
            <h2 className="text-3xl font-black text-gray-900">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Đội ngũ chuyên viên tư vấn giàu kinh nghiệm luôn sẵn sàng giải đáp 24/7</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form (Chỉ lấy Email) */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-100 flex flex-col justify-center">
              {contactSent ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Đăng ký thành công!</h3>
                  <p className="text-gray-500 text-center text-sm max-w-sm">
                    Cảm ơn bạn đã quan tâm. TravelGo sẽ gửi thông tin tour và các mã ưu đãi độc quyền qua email của bạn sớm nhất!
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSent(false)}
                    className="mt-2 text-blue-600 font-bold text-sm hover:underline cursor-pointer"
                  >
                    Gửi email khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-1">
                      Đăng ký để nhận thông báo nhận ưu đãi
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Để lại email để nhận thông báo sớm nhất về các đợt Flash Sale và voucher giảm giá đến 500.000đ
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                      Địa chỉ Email của bạn *
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button
                    disabled={contactLoading}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer text-sm"
                  >
                    <Send className="w-4 h-4" /> {contactLoading ? "Đang gửi..." : "Đăng ký nhận ưu đãi ngay"}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center">
                    <LockKeyhole className="inline w-3 h-3 mr-1" aria-hidden="true" />
                    Chúng tôi tôn trọng quyền riêng tư và cam kết không gửi thư rác.
                  </p>
                </form>
              )}
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: Phone, color: "bg-blue-100 text-blue-600", title: "Hotline hỗ trợ 24/7", lines: ["1800 1234 (Miễn phí cước gọi)", "Thứ 2 – Chủ nhật: 08:00 – 22:00"] },
                { icon: Mail, color: "bg-green-100 text-green-600", title: "Email tư vấn & CSKH", lines: ["hotro@travelgo.vn", "Phản hồi trong vòng 2 giờ làm việc"] },
                { icon: MapPin, color: "bg-orange-100 text-orange-600", title: "Trụ sở chính", lines: ["123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM", "Thứ 2 – Thứ 7: 08:00 – 18:00"] },
              ].map((item, index) => (
                <div key={item.title} className="home-reveal flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100" data-home-reveal-delay={index}>
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base mb-1">{item.title}</p>
                    {item.lines.map((l) => (
                      <p key={l} className="text-sm text-gray-600 leading-snug">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
