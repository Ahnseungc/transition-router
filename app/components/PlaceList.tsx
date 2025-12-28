import { Link } from "next-view-transitions";
import type { Post } from "../lib/api";

interface PlaceListProps {
  posts: Post[];
}

export function PlaceList({ posts }: PlaceListProps) {
  // Post 데이터를 Place 형태로 변환
  const places = posts.map((post, index) => ({
    id: post.id,
    name: post.title.substring(0, 30) + (post.title.length > 30 ? "..." : ""),
    category: "게시글",
    address: post.body.substring(0, 50) + (post.body.length > 50 ? "..." : ""),
    distance: `${(index + 1) * 0.3}km`,
    rating: Number((4 + Math.random() * 0.5).toFixed(1)),
  }));

  return (
    <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
      {places.map((place) => (
        <li key={place.id}>
          <Link
            href={`/detail/${place.id}`}
            className="block px-4 py-4 hover:bg-gray-50 dark:hover:bg-zinc-900 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-semibold text-black dark:text-white">
                    {place.name}
                  </h2>
                  <span className="text-xs text-gray-500 dark:text-zinc-400">
                    {place.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
                  {place.address}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                  <span>{place.distance}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    ⭐ {place.rating}
                  </span>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
