import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { blogService } from "../services/blogService";

const fallbackImage =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80";

function formatDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString("vi-VN");
}

export function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    blogService.getAll()
      .then((items) => {
        if (isMounted) setBlogs(items);
      })
      .catch((loadError) => {
        console.error("Lỗi khi tải cẩm nang:", loadError);
        if (isMounted) setError("Không thể tải danh sách cẩm nang. Vui lòng thử lại sau.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 sm:py-18">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
            <p className="font-bold uppercase tracking-wider text-blue-100">
              Cẩm nang du lịch TravelGo
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">
            Cảm hứng cho hành trình tiếp theo
          </h1>
          <p className="max-w-2xl text-blue-100 text-base sm:text-lg">
            Kinh nghiệm du lịch, gợi ý điểm đến và những thông tin hữu ích cho chuyến đi của bạn.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
              Khám phá và lên kế hoạch
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Tất cả bài viết</h2>
          </div>
          {!loading && !error && (
            <span className="text-sm text-gray-500">{blogs.length} bài viết</span>
          )}
        </div>

        {loading ? (
          <div className="min-h-64 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Đang tải bài viết...</span>
          </div>
        ) : error ? (
          <div role="alert" className="bg-white rounded-2xl border border-red-100 p-8 text-center text-red-700">
            {error}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/cam-nang/${encodeURIComponent(blog.slug || blog.id)}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-52 overflow-hidden bg-gray-100">
                  <img
                    src={blog.thumbnail || fallbackImage}
                    alt={blog.title}
                    loading="lazy"
                    onError={(event) => { event.currentTarget.src = fallbackImage; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                    <time>{formatDate(blog.createdAt)}</time>
                    <span>·</span>
                    <span>Cẩm nang</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {blog.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                    Đọc bài viết <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-14 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" aria-hidden="true" />
            <h3 className="text-lg font-bold text-gray-800">Chưa có bài viết nào</h3>
            <p className="text-sm text-gray-500 mt-2">Các bài viết cẩm nang sẽ sớm được cập nhật.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default BlogListPage;
