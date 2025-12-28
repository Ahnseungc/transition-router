// JSONPlaceholder API를 사용하여 데이터 가져오기
const API_URL = "https://jsonplaceholder.typicode.com/posts";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// React Query와 서버 컴포넌트 모두에서 사용할 데이터 fetching 함수
export async function fetchPosts(): Promise<Post[]> {
  // 인위적인 딜레이 추가 (스트리밍 효과를 보기 위해)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch(API_URL, {
      // React Query에서 사용할 때는 cache 설정 무시됨
      next: { revalidate: 60 }, // 서버 컴포넌트용
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    // 처음 10개만 반환
    return posts.slice(0, 10);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

// 단일 포스트 가져오기
export async function fetchPost(id: number): Promise<Post> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}
