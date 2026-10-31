import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, AlertCircle } from "lucide-react";
import { tourService } from "../services/tourService";
import {
  TourGallery,
  TourHeader,
  TourDeparturesSelector,
  TourTabs,
  TourBookingSidebar,
} from "../components";
import { authService } from "../../auth/services/authService";
import { toast } from "sonner";

export function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const detailRef = useRef(null);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [date, setDate] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await tourService.getTourBySlug(slug);
        if (!data) {
          if (isMounted) {
            setTour(null);
            setReviews([]);
          }
          return;
        }

        if (isMounted) {
          setTour(data);
          if (data?.apiReviews && data.apiReviews.length > 0) {
            setReviews(data.apiReviews);
          } else {
            const revs = await tourService.getReviewsByTour(data.id);
            if (isMounted) setReviews(revs || []);
          }

          if (data?.departures && data.departures.length > 0) {
            const firstDep = data.departures[0];
            setSelectedDeparture(firstDep);
            if (firstDep.startTime) {
              setDate(firstDep.startTime.split("T")[0]);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin tour:", error);
        if (isMounted) {
          setTour(null);
          setReviews([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (loading || !tour) return undefined;

    const revealItems = detailRef.current?.querySelectorAll(".tour-detail-reveal:not(.is-visible)");
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
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [loading, tour?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" aria-busy="true" aria-live="polite">
        <p className="sr-only">Đang tải thông tin chuyến đi...</p>
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="animate-pulse rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="h-72 rounded-2xl bg-gray-200 sm:h-96 md:h-[450px]" />
                <div className="mt-4 flex gap-2.5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-16 w-24 shrink-0 rounded-xl bg-gray-100 sm:h-20 sm:w-28" />
                  ))}
                </div>
              </div>

              <div className="animate-pulse space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="h-7 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
              </div>

              <div className="animate-pulse space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="h-6 w-48 rounded bg-gray-200" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-28 rounded-2xl bg-gray-100" />
                  ))}
                </div>
              </div>

              <div className="animate-pulse overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex gap-6 border-b border-gray-100 px-6 py-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-4 w-20 rounded bg-gray-200" />
                  ))}
                </div>
                <div className="space-y-4 p-6">
                  <div className="h-5 w-44 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            </div>

            <aside className="animate-pulse space-y-6 self-start rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <div className="h-3 w-24 rounded bg-gray-100" />
                <div className="h-9 w-48 rounded bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-100" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="h-16 rounded-2xl bg-gray-100" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-40 rounded bg-gray-200" />
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-200" />
                      <div className="h-3 w-28 rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-20 rounded-full bg-gray-100" />
                  </div>
                ))}
              </div>
              <div className="h-12 rounded-xl bg-blue-100" />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-16 h-16 text-gray-300" />
        <p className="text-2xl font-black text-gray-800">Tour không tồn tại</p>
        <p className="text-sm text-gray-500">
          Chuyến đi bạn đang tìm kiếm có thể đã kết thúc hoặc không còn mở bán.
        </p>
        <Link
          to="/home"
          className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    );
  }

  const unitPrice = selectedDeparture?.priceAdult
    ? Number(selectedDeparture.priceAdult)
    : (tour.price || 0);
  const childPrice = selectedDeparture?.priceChildren
    ? Number(selectedDeparture.priceChildren)
    : Math.round(unitPrice * 0.5);
  const babyPrice = selectedDeparture?.priceBaby !== undefined && selectedDeparture?.priceBaby !== null
    ? Number(selectedDeparture.priceBaby)
    : 0;

  const totalPrice = adults * unitPrice + children * childPrice + babies * babyPrice;

  const stockAdult = selectedDeparture?.stockAdult !== undefined ? Number(selectedDeparture.stockAdult) : (tour.maxPeople || 50);
  const stockChildren = selectedDeparture?.stockChildren !== undefined ? Number(selectedDeparture.stockChildren) : 20;
  const stockBaby = selectedDeparture?.stockBaby !== undefined ? Number(selectedDeparture.stockBaby) : 10;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : tour.rating;

  const handleSelectDeparture = (dep) => {
    setSelectedDeparture(dep);
    if (dep.startTime) {
      setDate(dep.startTime.split("T")[0]);
    }
  };

  const handleBook = () => {
    if (!tour.departures || tour.departures.length === 0) {
      toast.error("Hiện tại tour chưa có lịch khởi hành sắp tới.");
      return;
    }
    if (!selectedDeparture || !date) {
      toast.error("Vui lòng chọn đợt khởi hành");
      return;
    }
    if (adults < 1) {
      toast.error("Chuyến đi cần ít nhất 1 người lớn đi cùng");
      return;
    }
    if (adults > stockAdult) {
      toast.error(`Số lượng người lớn (${adults}) vượt quá số chỗ còn lại (${stockAdult} chỗ)`);
      return;
    }
    if (children > stockChildren) {
      toast.error(`Số lượng trẻ em (${children}) vượt quá số chỗ còn lại (${stockChildren} chỗ)`);
      return;
    }
    if (babies > stockBaby) {
      toast.error(`Số lượng em bé (${babies}) vượt quá số chỗ còn lại (${stockBaby} chỗ)`);
      return;
    }

    const bookingState = {
      tour: {
        ...tour,
        price: unitPrice,
        departure: selectedDeparture,
      },
      date,
      adults,
      children,
      babies,
      unitPrice,
      childPrice,
      babyPrice,
      totalPrice,
    };

    if (!authService.getCurrentUser()) {
      toast.info("Vui lòng đăng nhập để tiếp tục đặt tour.");
      navigate("/login", {
        state: {
          from: {
            pathname: "/booking",
            state: bookingState,
          },
        },
      });
      return;
    }

    navigate("/booking", { state: bookingState });
  };

  const handleAddReview = async (newRev) => {
    const revObj = {
      id: Date.now(),
      tourId: tour.id,
      author: newRev.author,
      avatar: "",
      rating: newRev.rating,
      date: new Date().toISOString().split("T")[0],
      comment: newRev.comment,
    };
    try {
      await tourService.submitReview({
        tourId: tour.id,
        rating: newRev.rating,
        content: newRev.comment,
      });
      setReviews((prev) => [revObj, ...prev]);
      toast.success("Cảm ơn bạn đã gửi đánh giá cho chuyến đi!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Không thể gửi đánh giá. Vui lòng đăng nhập và thử lại."
      );
    }
  };

  return (
    <div ref={detailRef} className="tour-detail-page bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="tour-detail-reveal bg-white border-b" data-tour-reveal-delay="1">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/home" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{tour.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium line-clamp-1">{tour.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            <div className="tour-detail-reveal" data-tour-reveal-delay="2">
              <TourGallery
                images={tour.images}
                tourName={tour.name}
                discount={tour.discount}
              />
            </div>

            <div className="tour-detail-reveal" data-tour-reveal-delay="3">
              <TourHeader
                tour={tour}
                avgRating={avgRating}
                reviewCount={reviews.length + (tour.reviewCount || 0)}
              />
            </div>

            <div className="tour-detail-reveal" data-tour-reveal-delay="4">
              <TourDeparturesSelector
                departures={tour.departures}
                selectedDeparture={selectedDeparture}
                onSelect={handleSelectDeparture}
                defaultTourPrice={tour.price}
              />
            </div>

            <div className="tour-detail-reveal" data-tour-reveal-delay="5">
              <TourTabs
                tour={tour}
                reviews={reviews}
                avgRating={avgRating}
                onAddReview={handleAddReview}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="tour-detail-reveal" data-tour-reveal-delay="3">
            <TourBookingSidebar
              tour={tour}
              date={date}
              setDate={setDate}
              departures={tour.departures}
              selectedDeparture={selectedDeparture}
              onSelectDeparture={handleSelectDeparture}
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
              babies={babies}
              setBabies={setBabies}
              unitPrice={unitPrice}
              childPrice={childPrice}
              babyPrice={babyPrice}
              stockAdult={stockAdult}
              stockChildren={stockChildren}
              stockBaby={stockBaby}
              totalPrice={totalPrice}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetailPage;
