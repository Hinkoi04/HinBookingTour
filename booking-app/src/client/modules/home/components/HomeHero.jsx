import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Search } from "lucide-react";
import "./HomeHero.css";

const SLIDE_DURATION = 3000;

const slides = [
  {
    eyebrow: "Hành trình phía Bắc",
    title: "Chạm vào mây trời\nHà Giang",
    description:
      "Băng qua những cung đèo hùng vĩ, thức giấc giữa biển mây và lắng nghe nhịp sống bình yên nơi địa đầu Tổ quốc.",
    location: "Hà Giang, Việt Nam",
    duration: "4 ngày 3 đêm",
    price: "Từ 6.890.000đ",
    image:
      "https://images.unsplash.com/photo-1620299813821-01fc99b67409?auto=format&fit=crop&w=2400&q=90",
    photographer: "Hoach Le Dinh",
    photographerUrl: "https://unsplash.com/@hoachld",
    accent: "#d8ff63",
  },
  {
    eyebrow: "Kỳ nghỉ nhiệt đới",
    title: "Thả mình giữa\nđại dương xanh",
    description:
      "Một thiên đường nguyên sơ với cát trắng, làn nước trong veo và những buổi chiều chỉ dành riêng cho bạn.",
    location: "Maldives",
    duration: "5 ngày 4 đêm",
    price: "Từ 24.900.000đ",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=2400&q=90",
    photographer: "Shifaaz Shamoon",
    photographerUrl: "https://unsplash.com/@sotti",
    accent: "#7ee7ff",
  },
  {
    eyebrow: "Nhịp sống châu Á",
    title: "Tokyo rực rỡ\nsau hoàng hôn",
    description:
      "Lạc bước giữa những con phố ánh sáng, thưởng thức tinh hoa ẩm thực và khám phá một Tokyo không ngủ.",
    location: "Tokyo, Nhật Bản",
    duration: "6 ngày 5 đêm",
    price: "Từ 32.500.000đ",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2400&q=90",
    photographer: "Jezael Melgoza",
    photographerUrl: "https://unsplash.com/@jezar",
    accent: "#ffb8cc",
  },
];

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function HomeHero({ search, setSearch, searchDate, setSearchDate, onSearch }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [parallax, setParallax] = useState(0);
  const touchStart = useRef(null);
  const activeSlide = slides[activeIndex];

  const goToSlide = useCallback((index) => {
    setActiveIndex((index + slides.length) % slides.length);
    setCycle((value) => value + 1);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((index) => (index + 1) % slides.length);
    setCycle((value) => value + 1);
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setTimeout(nextSlide, SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeIndex, cycle, isPaused, nextSlide]);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setParallax(Math.min(window.scrollY * 0.24, 180));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target?.tagName) || event.target?.isContentEditable) {
        return;
      }
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") goToSlide(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToSlide, nextSlide]);

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = touchStart.current - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 45) {
      if (distance > 0) nextSlide();
      else goToSlide(activeIndex - 1);
    }
    touchStart.current = null;
  };

  return (
    <>
      <section
        className="home-feature-hero"
        aria-roledescription="carousel"
        aria-label="Các hành trình nổi bật"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="hero__backgrounds"
          style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
        >
          {slides.map((slide, index) => (
            <div
              className={`hero__background ${index === activeIndex ? "is-active" : ""}`}
              key={slide.location}
              style={{ backgroundImage: `url("${slide.image}")` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__count" aria-hidden="true">
            <span>0{activeIndex + 1}</span>
            <i />
            <span>0{slides.length}</span>
          </div>

          <div className="hero__copy" key={`copy-${activeIndex}`}>
            <div className="eyebrow">
              <span />
              {activeSlide.eyebrow}
            </div>
            <h1>
              {activeSlide.title.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p>{activeSlide.description}</p>
            <a className="primary-cta" href="#domestic">
              <span>Khám phá ngay</span>
              <ArrowRight />
            </a>
          </div>

          <aside className="tour-card" key={`card-${activeIndex}`}>
            <div className="tour-card__top">
              <span className="tour-card__label">Hành trình nổi bật</span>
              <span className="tour-card__badge">Bán chạy</span>
            </div>
            <div className="tour-card__location">
              <LocationIcon />
              <div>
                <small>Điểm đến</small>
                <strong>{activeSlide.location}</strong>
              </div>
            </div>
            <div className="tour-card__meta">
              <div>
                <small>Thời lượng</small>
                <strong>{activeSlide.duration}</strong>
              </div>
              <div>
                <small>Chi phí</small>
                <strong>{activeSlide.price}</strong>
              </div>
            </div>
            <a href="#domestic">
              Xem các hành trình
              <ArrowRight />
            </a>
          </aside>
        </div>

        <div className="hero__controls">
          <div className="arrows">
            <button
              type="button"
              aria-label="Slide trước"
              onClick={() => goToSlide(activeIndex - 1)}
            >
              <ArrowLeft />
            </button>
            <button type="button" aria-label="Slide tiếp theo" onClick={nextSlide}>
              <ArrowRight />
            </button>
          </div>
          <div className="dots" role="group" aria-label="Chọn hành trình">
            {slides.map((slide, index) => (
              <button
                key={slide.location}
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                aria-pressed={index === activeIndex}
                aria-label={`Đến slide ${index + 1}: ${slide.location}`}
                onClick={() => goToSlide(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="photo-credit">
            Ảnh bởi{" "}
            <a href={activeSlide.photographerUrl} target="_blank" rel="noreferrer">
              {activeSlide.photographer}
            </a>
          </div>
        </div>

        <div className="progress-track" aria-hidden="true">
          <span
            key={`${activeIndex}-${cycle}`}
            className={isPaused ? "is-paused" : ""}
            style={{ backgroundColor: activeSlide.accent }}
          />
        </div>
      </section>

      <section className="after-hero" id="hanh-trinh">
        <div className="after-hero__search">
          <label>
            <span>Điểm đến</span>
            <span className="after-hero__input">
              <Search aria-hidden="true" />
              <input
                type="search"
                placeholder="Bạn muốn đi đâu?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && onSearch()}
              />
            </span>
          </label>
          <label>
            <span>Ngày khởi hành</span>
            <span className="after-hero__input">
              <Calendar aria-hidden="true" />
              <input
                type="date"
                value={searchDate}
                onChange={(event) => setSearchDate(event.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </span>
          </label>
          <button type="button" onClick={onSearch}>
            Tìm kiếm tour
            <ArrowRight />
          </button>
        </div>
      </section>
    </>
  );
}

export default HomeHero;
