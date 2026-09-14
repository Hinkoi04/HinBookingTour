import { useState } from "react";
import { Star } from "lucide-react";

export function StarRow({ rating, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 transition-colors ${
            i <= (interactive ? hover || rating : rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i)}
        />
      ))}
    </div>
  );
}

export default StarRow;
