"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchPost } from "../lib/api";
import type { Post } from "../lib/api";

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function usePost(id: number) {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
