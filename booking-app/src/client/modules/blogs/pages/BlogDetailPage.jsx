import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { blogService } from "../services/blogService";

const fallbackImage =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80";

function formatDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString("vi-VN");
}

function sanitizeBlogContent(content) {
  const document = new DOMParser().parseFromString(content || "", "text/html");
  document.querySelectorAll("script, style, iframe, object, embed, form, svg, math, link, meta")
    .forEach((element) => element.remove());

  document.body.querySelectorAll("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on") || name === "style" || name === "srcdoc" || name === "srcset") {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === "href" || name === "src" || name === "xlink:href") {
        const value = attribute.value.trim();
        if (value.startsWith("#")) return;
        try {
          const protocol = new URL(value, window.location.origin).protocol;
          if (!["http:", "https:", "mailto:", "tel:"].includes(protocol)) {
            element.removeAttribute(attribute.name);
          }
        } catch {
          element.removeAttribute(attribute.name);
        }
      }
    });

    if (element.tagName === "A" && element.getAttribute("target") === "_blank") {
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  return document.body.innerHTML;
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setBlog(null);
    setError("");

    blogService.getBySlug(slug)
      .then((item) => {
        if (isMounted) setBlog(item);
      })
      .catch((loadError) => {
        console.error(`Lỗi khi tải bài viết ${slug}:`, loadError);
        if (isMounted) setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <span>Đang tải bài viết...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <BookOpen className="w-12 h-12 text-gray-300" aria-hidden="true" />
        <h1 className="text-2xl font-black text-gray-800">
          {error ? "Có lỗi xảy ra" : "Không tìm thấy bài viết"}
        </h1>
        {error && <p role="alert" className="text-gray-500">{error}</p>}
        <Link to="/cam-nang" className="font-bold text-blue-600 hover:text-blue-700">
          Quay lại cẩm nang
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <article className="max-w-4xl mx-auto px-4">
        <Link
          to="/cam-nang"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Tất cả cẩm nang
        </Link>

        <header className="mb-7">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4">
            Cẩm nang du lịch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            <time>{formatDate(blog.createdAt)}</time>
            <span>·</span>
            <span>TravelGo</span>
          </div>
        </header>

        <img
          src={blog.thumbnail || fallbackImage}
          alt={blog.title}
          onError={(event) => { event.currentTarget.src = fallbackImage; }}
          className="w-full max-h-[480px] object-cover rounded-2xl mb-8"
        />

        {blog.description && (
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium mb-8">
            {blog.description}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(blog.content) }}
        />

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link to="/cam-nang" className="font-bold text-blue-600 hover:text-blue-700">
            ← Xem thêm bài viết cẩm nang
          </Link>
        </div>
      </article>
    </main>
  );
}

export default BlogDetailPage;
