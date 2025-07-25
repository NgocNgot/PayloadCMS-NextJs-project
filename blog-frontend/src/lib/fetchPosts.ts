import { PostType } from "@/types/Post";

const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchPostsBasedOnQuery(
  query: string
): Promise<PostType[]> {
  try {
    const apiUrl = `${PAYLOAD_SERVER_URL}/api/posts?depth=2`;

    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const allPosts: PostType[] = data.docs;

    if (query) {
      return allPosts.filter((post) =>
        (post.title || "").toLowerCase().includes(query.toLowerCase())
      );
    }

    return allPosts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}
