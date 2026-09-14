import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { tourService } from "../services/tourService";
import {
  TourGallery,
  TourHeader,
  TourDeparturesSelector,
  TourTabs,
  TourBookingSidebar,
} from "../components";
import { toast } from "sonner";

export function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [date, setDate] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await tourService.getTourById(id);
        if (isMounted) {
          setTour(data);
          if (data?.apiReviews && data.apiReviews.length > 0) {
            setReviews(data.apiReviews);
          } else {
            const revs = await tourService.getReviewsByTour(id);
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
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTour();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải thông tin chuyến đi...</p>
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
    : tour.price;
  const childPrice = selectedDeparture?.priceChildren
    ? Number(selectedDeparture.priceChildren)
    : tour.price * 0.5;
  const totalPrice = adults * unitPrice + children * childPrice;
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
    if (!date) {
      toast.error("Vui lòng chọn ngày khởi hành");
      return;
    }
    navigate("/booking", {
      state: {
        tour: {
          ...tour,
          price: unitPrice,
          departure: selectedDeparture,
        },
        date,
        adults,
        children,
        totalPrice,
      },
    });
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
    await tourService.submitReview({
      tourId: tour.id,
      rating: newRev.rating,
      content: newRev.comment,
    });
    setReviews((prev) => [revObj, ...prev]);
    toast.success("Cảm ơn bạn đã gửi đánh giá cho chuyến đi!");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
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
            <TourGallery
              images={tour.images}
              tourName={tour.name}
              discount={tour.discount}
            />

            <TourHeader
              tour={tour}
              avgRating={avgRating}
              reviewCount={reviews.length + (tour.reviewCount || 0)}
            />

            <TourDeparturesSelector
              departures={tour.departures}
              selectedDeparture={selectedDeparture}
              onSelect={handleSelectDeparture}
              defaultTourPrice={tour.price}
            />

            <TourTabs
              tour={tour}
              reviews={reviews}
              avgRating={avgRating}
              onAddReview={handleAddReview}
            />
          </div>

          {/* RIGHT */}
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
            unitPrice={unitPrice}
            childPrice={childPrice}
            totalPrice={totalPrice}
            onBook={handleBook}
          />
        </div>
      </div>
    </div>
  );
}

export default TourDetailPage;
