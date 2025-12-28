"use client";

import { PlaceList } from "./PlaceList";
import { PlaceListSkeleton } from "./PlaceListSkeleton";
import { usePosts } from "../hooks/usePosts";

export function PlaceListClient() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return <PlaceListSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-red-500 dark:text-red-400">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500 dark:text-zinc-400">데이터가 없습니다.</p>
      </div>
    );
  }

  return <PlaceList posts={posts} />;
}
