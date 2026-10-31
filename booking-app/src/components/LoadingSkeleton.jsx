function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`loading-skeleton rounded ${className}`} />;
}

export function LoadingSkeleton({ variant = "list", className = "" }) {
  return (
    <div
      role="status"
      aria-label="Đang tải dữ liệu"
      className={`w-full ${className}`}
    >
      <span className="sr-only">Đang tải dữ liệu...</span>

      {variant === "cards" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <SkeletonBlock className="h-44 w-full rounded-xl" />
              <div className="space-y-3 pt-4">
                <SkeletonBlock className="h-3 w-1/3" />
                <SkeletonBlock className="h-5 w-4/5" />
                <SkeletonBlock className="h-3 w-2/3" />
                <SkeletonBlock className="h-8 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === "table" && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-4 grid grid-cols-5 gap-4 border-b border-gray-100 pb-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <SkeletonBlock key={item} className="h-4 w-3/4" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="grid grid-cols-5 items-center gap-4 border-b border-gray-50 pb-4 last:border-0">
                {[1, 2, 3, 4, 5].map((column) => (
                  <SkeletonBlock
                    key={column}
                    className={`h-4 ${column === 1 ? "w-4/5" : "w-2/3"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "detail" && (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-64 w-full rounded-xl" />
          <SkeletonBlock className="h-6 w-2/3" />
          <SkeletonBlock className="h-4 w-1/3" />
          <div className="space-y-3 pt-2">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-11/12" />
            <SkeletonBlock className="h-3 w-4/5" />
          </div>
        </div>
      )}

      {variant === "form" && (
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-6 w-1/3" />
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2">
              <SkeletonBlock className="h-3 w-1/4" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
        </div>
      )}

      {variant === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <SkeletonBlock className="h-4 w-1/2" />
                <SkeletonBlock className="h-8 w-2/3" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SkeletonBlock className="h-72 rounded-2xl lg:col-span-2" />
            <SkeletonBlock className="h-72 rounded-2xl" />
          </div>
          <SkeletonBlock className="h-64 rounded-2xl" />
        </div>
      )}

      {variant === "list" && (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-1/3" />
              </div>
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoadingSkeleton;
