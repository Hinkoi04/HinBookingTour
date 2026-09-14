import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock, MapPin, ArrowRight, Search, Calendar, ChevronRight,
  Send, Phone, Mail, CheckCircle, Filter, X
} from "lucide-react";
import { homeService } from "../services/homeService";
import { TourCard, FlashSaleCard, TourSkeleton } from "../components";
import { toast } from "sonner";

function useCountdown(targetMs) {
  const [timeLeft, setTimeLeft] = useState(targetMs);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";

  const countdown = useCountdown(8 * 3600000 + 23 * 60000 + 45000);
  const [search, setSearch] = useState(searchQuery);
  const [searchDate, setSearchDate] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const [allTours, setAllTours] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

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
    if (!search.trim()) {
      toast.error("Vui lòng nhập điểm đến hoặc tên tour");
      return;
    }
    setSearchParams({ q: search.trim() });
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
    await homeService.sendContact({ email: contactEmail.trim(), message: "Đăng ký nhận tin & tư vấn tour từ TravelGo" });
    setContactSent(true);
    setContactEmail("");
    toast.success("Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ gửi ưu đãi sớm nhất.");
  };

  const flashSaleItems = homeService.getFlashSaleItems(allTours);
  const domesticTours = allTours.filter((t) => t.type === "domestic");
  const internationalTours = allTours.filter((t) => t.type === "international");

  const categoryCards = [
    { label: "Tour Miền Bắc", desc: "Hạ Long, Sapa, Hà Nội", img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" },
    { label: "Tour Miền Nam", desc: "Phú Quốc, Mũi Né, Cần Thơ", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80" },
    { label: "Tour Miền Trung", desc: "Đà Nẵng, Hội An, Huế", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80" },
    { label: "Tour Quốc tế", desc: "Nhật, Thái, Hàn, Châu Âu", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
  ].map((cat) => {
    const count = allTours.filter(
      (t) =>
        (t.category || "").toLowerCase().includes(cat.label.toLowerCase().replace("tour ", "")) ||
        (cat.label === "Tour Quốc tế" && t.type === "international")
    ).length;
    return { ...cat, count: count > 0 ? count : (allTours.length > 0 ? Math.ceil(allTours.length / 4) : 10) };
  });

  const filteredTours = (searchQuery || selectedCategory)
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
        return matchQuery && matchCategory;
      })
    : [];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/75 to-blue-950/80" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 w-full flex flex-col items-center justify-center text-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md text-blue-200 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full border border-blue-400/30 mb-6 shadow-sm">
            ✈️ Khám phá thế giới cùng TravelGo
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
            Hành Trình <span className="text-yellow-400 drop-shadow-md">Đáng Nhớ</span> Của Bạn
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Khám phá hơn 500+ tour du lịch trong nước và quốc tế với giá ưu đãi nhất. Đặt chỗ linh hoạt, dịch vụ tận tâm 24/7.
          </p>

          {/* Search box */}
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/40">
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
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-12 pt-8 border-t border-white/10 w-full max-w-3xl">
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
      {(searchQuery || selectedCategory) && (
        <section id="search-results" className="py-14 bg-blue-50/50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4">
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
                <p className="text-4xl mb-3">🔍</p>
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
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="p-2 bg-white/20 rounded-xl text-2xl">🔥</span>
                  <h2 className="text-3xl font-black text-white">Flash Sale Giờ Vàng</h2>
                </div>
                <p className="text-red-100 text-sm sm:text-base">
                  Ưu đãi giảm sốc trong 30 ngày tới ({flashSaleItems.length} chuyến) – Đặt ngay kẻo lỡ!
                </p>
              </div>
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <p className="text-white/90 text-xs sm:text-sm font-bold">Kết thúc sau:</p>
                {[countdown.h, countdown.m, countdown.s].map((val, i) => (
                  <span key={i} className="flex items-center">
                    <span className="bg-white text-red-600 text-xl sm:text-2xl font-black px-3 py-1.5 rounded-xl min-w-[2.8rem] text-center inline-block shadow">
                      {val}
                    </span>
                    {i < 2 && <span className="text-white font-black text-xl mx-1">:</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
              {flashSaleItems.map((item) => (
                <FlashSaleCard
                  key={`${item.id}-${item.departureId || item.departureTime}`}
                  item={item}
                />
              ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categoryCards.map((cat) => (
              <div
                key={cat.label}
                onClick={() => setSearchParams({ category: cat.label })}
                className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all"
              >
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
            ))}
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
              {(domesticTours.length > 0 ? domesticTours : allTours).slice(0, 8).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
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
              {(internationalTours.length > 0 ? internationalTours : allTours.slice(4, 12)).slice(0, 8).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
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
              { icon: "🏆", title: "10 Năm Kinh Nghiệm", desc: "Đội ngũ chuyên nghiệp với hàng nghìn hành trình hoàn hảo" },
              { icon: "💰", title: "Giá Tốt Nhất", desc: "Cam kết giá cạnh tranh, chính sách hoàn tiền minh bạch" },
              { icon: "🛡️", title: "An Toàn - Uy Tín", desc: "Bảo hiểm toàn diện, hỗ trợ 24/7 trong suốt chuyến đi" },
              { icon: "⭐", title: "98% Hài Lòng", desc: "Khách hàng luôn tin tưởng và tiếp tục lựa chọn đồng hành" },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-5xl mb-4">{item.icon}</div>
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
            <a href="#blogs" className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogsList.slice(0, 3).map((blog) => (
                <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group block border border-gray-100">
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
                </div>
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
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer text-sm"
                  >
                    <Send className="w-4 h-4" /> Đăng ký nhận ưu đãi ngay
                  </button>

                  <p className="text-[11px] text-gray-400 text-center">
                    🔒 Chúng tôi tôn trọng quyền riêng tư và cam kết không gửi thư rác.
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
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
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
