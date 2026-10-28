import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDownAZ, ArrowDownUp, ArrowUpAZ, Flame, Globe, Loader2, MapPin,
  RotateCcw, Search, SlidersHorizontal, Users,
} from "lucide-react";
import { homeService } from "../../home/services/homeService";
import { TourCard } from "../../home/components";

const priceRanges = [
  { value: "under-5m", label: "Dưới 5 triệu", max: 5000000 },
  { value: "5m-10m", label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { value: "10m-20m", label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { value: "over-20m", label: "Từ 20 triệu", min: 20000000 },
];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const pageDetails = {
  domestic: {
    title: "Tour trong nước",
    description: "Khám phá những hành trình tuyệt vời trên khắp Việt Nam.",
    icon: MapPin,
    accent: "blue",
  },
  international: {
    title: "Tour quốc tế",
    description: "Trải nghiệm các điểm đến hấp dẫn trên khắp thế giới.",
    icon: Globe,
    accent: "purple",
  },
};

export function TourListPage() {
  const { type } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftFilters, setDraftFilters] = useState({
    query: "",
    departureLocation: "",
    departureDate: "",
    adults: 0,
    children: 0,
    babies: 0,
    priceRange: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [sortOrder, setSortOrder] = useState("");
  const page = Object.prototype.hasOwnProperty.call(pageDetails, type)
    ? pageDetails[type]
    : null;
  const Icon = page?.icon || Search;

  const departureLocations = useMemo(() => {
    const locations = tours.flatMap((tour) => {
      const departures = tour.allDepartures?.length
        ? tour.allDepartures
        : tour.departures || [];
      const fromDepartures = departures
        .map((departure) => departure.departureFrom)
        .filter(Boolean);
      return fromDepartures.length > 0
        ? fromDepartures
        : String(tour.departureFrom || "").split(/\s*[,/|]\s*/).filter(Boolean);
    });
    return [...new Set(locations)].sort((a, b) => a.localeCompare(b, "vi"));
  }, [tours]);

  const filteredTours = useMemo(() => {
    const query = normalizeText(appliedFilters.query.trim());
    const priceRange = priceRanges.find((range) => range.value === appliedFilters.priceRange);
    const results = tours.filter((tour) => {
      const searchableText = normalizeText([
        tour.name,
        tour.category,
        tour.location,
        tour.description,
      ].join(" "));
      const price = Number(tour.price) || 0;
      const departures = tour.allDepartures?.length
        ? tour.allDepartures
        : tour.departures || [];
      const hasDepartureFilters = Boolean(
        appliedFilters.departureLocation ||
        appliedFilters.departureDate ||
        appliedFilters.adults ||
        appliedFilters.children ||
        appliedFilters.babies
      );
      const matchingDeparture = !hasDepartureFilters || departures.some((departure) => {
        const matchesLocation = !appliedFilters.departureLocation ||
          departure.departureFrom === appliedFilters.departureLocation;
        const matchesDate = !appliedFilters.departureDate ||
          String(departure.startTime || "").startsWith(appliedFilters.departureDate);
        const matchesAdults = !appliedFilters.adults ||
          departure.stockAdult === undefined ||
          Number(departure.stockAdult) >= Number(appliedFilters.adults);
        const matchesChildren = !appliedFilters.children ||
          departure.stockChildren === undefined ||
          Number(departure.stockChildren) >= Number(appliedFilters.children);
        const matchesBabies = !appliedFilters.babies ||
          departure.stockBaby === undefined ||
          Number(departure.stockBaby) >= Number(appliedFilters.babies);
        return matchesLocation && matchesDate && matchesAdults && matchesChildren && matchesBabies;
      });

      return (
        (!query || searchableText.includes(query)) &&
        matchingDeparture &&
        (!priceRange || (
          (priceRange.min === undefined || price >= priceRange.min) &&
          (priceRange.max === undefined || price < priceRange.max)
        ))
      );
    });

    if (sortOrder === "price-asc") {
      results.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortOrder === "discount") {
      results.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
    }

    return results;
  }, [tours, appliedFilters, sortOrder]);

  const hasActiveFilters = Boolean(
    appliedFilters.query ||
    appliedFilters.departureLocation ||
    appliedFilters.departureDate ||
    appliedFilters.adults ||
    appliedFilters.children ||
    appliedFilters.babies ||
    appliedFilters.priceRange
  );

  const updateDraftFilter = (key, value) => {
    setDraftFilters((filters) => ({ ...filters, [key]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      query: "",
      departureLocation: "",
      departureDate: "",
      adults: 0,
      children: 0,
      babies: 0,
      priceRange: "",
    };
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSortOrder("");
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    homeService.getAllTours().then((items) => {
      if (isMounted) {
        setTours(items.filter((tour) => tour.type === type));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [type]);

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Search className="w-12 h-12 text-gray-300" aria-hidden="true" />
        <h1 className="text-2xl font-black text-gray-800">Không tìm thấy danh mục tour</h1>
        <Link to="/home" className="font-bold text-blue-600 hover:text-blue-700">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8">
          <aside className="h-fit lg:sticky lg:top-32 lg:self-start bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-purple-800">Bộ lọc</h2>
              <SlidersHorizontal className="w-5 h-5 text-purple-800" aria-hidden="true" />
            </div>

            <form onSubmit={applyFilters} className="p-5 space-y-5">
              <label className="block">
                <span className="block text-sm font-bold text-gray-700 mb-2">Tìm tour</span>
                <span className="relative block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="search"
                    value={draftFilters.query}
                    onChange={(event) => updateDraftFilter("query", event.target.value)}
                    placeholder="Tên tour, điểm đến..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </span>
              </label>

              <label className="block">
                <span className="block text-sm font-bold text-gray-700 mb-2">Ngày khởi hành</span>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={draftFilters.departureDate}
                  onChange={(event) => updateDraftFilter("departureDate", event.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </label>

              <fieldset>
                <legend className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  Số lượng hành khách
                </legend>
                <div className="space-y-2">
                  {[
                    ["adults", "Người lớn"],
                    ["children", "Trẻ em"],
                    ["babies", "Em bé"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between gap-3 px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                      <span className="text-gray-600">{label}</span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={draftFilters[key]}
                        onChange={(event) => updateDraftFilter(key, Math.max(0, Number(event.target.value)))}
                        aria-label={label}
                        className="w-16 text-right font-bold text-gray-800 outline-none"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="block text-sm font-bold text-gray-700 mb-2">Mức giá</span>
                <select
                  value={draftFilters.priceRange}
                  onChange={(event) => updateDraftFilter("priceRange", event.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Tất cả mức giá --</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition-colors"
                >
                  Áp dụng
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    aria-label="Xóa bộ lọc"
                    title="Xóa bộ lọc"
                    className="px-3 border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>
          </aside>

          <main className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-7 h-7 text-purple-800" aria-hidden="true" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-purple-800">{page.title}</h1>
                <p className="text-sm text-gray-500 mt-1">{page.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm font-bold text-gray-800">Sắp xếp:</span>
              {[
                { value: "price-asc", label: "Giá tăng dần", icon: ArrowUpAZ },
                { value: "price-desc", label: "Giá giảm dần", icon: ArrowDownAZ },
                { value: "discount", label: "Khuyến Mãi Hot", icon: Flame },
              ].map(({ value, label, icon: SortIcon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortOrder(sortOrder === value ? "" : value)}
                  aria-pressed={sortOrder === value}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    sortOrder === value
                      ? "text-purple-800 font-bold"
                      : "text-gray-600 hover:text-purple-700"
                  }`}
                >
                  {label}
                  <SortIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              ))}
              <span className="ml-auto text-sm font-semibold text-gray-700">
                Tất cả: <strong>{loading ? "…" : filteredTours.length} Tour</strong>
                {hasActiveFilters && !loading && <span className="text-gray-400"> / {tours.length}</span>}
              </span>
            </div>

            {loading ? (
              <div className="min-h-64 flex items-center justify-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-purple-700" />
                <span>Đang tải danh sách tour...</span>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
              </div>
            ) : (
              <div className="min-h-80 bg-white rounded-2xl border border-dashed border-gray-300 px-6 py-14 flex flex-col items-center justify-center text-center">
                <Search className="w-12 h-12 text-sky-400 mb-4" aria-hidden="true" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {tours.length === 0 ? "Chưa có tour nào trong danh mục này" : "Rất tiếc, không có tour nào phù hợp!"}
                </h2>
                <p className="text-gray-500 mb-5">
                  {tours.length === 0
                    ? "Hãy quay lại sau để khám phá các hành trình mới."
                    : "Vui lòng thử thay đổi ngày khởi hành, điểm đi hoặc mức giá."}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-bold text-purple-700 hover:text-purple-800"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

export default TourListPage;
