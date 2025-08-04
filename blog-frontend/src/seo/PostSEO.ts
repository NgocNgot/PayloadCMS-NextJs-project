// src/lib/postMetadata.ts
import type { Metadata } from "next";
import type { PostType } from "@/types/Post";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
const PAYLOAD_SERVER_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";

// Hàm helper để lấy dữ liệu bài viết
// Hàm này là Server-side, an toàn để gọi trong generateMetadata
async function getPostBySlug(slug: string): Promise<PostType | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_SERVER_URL}/api/posts?where[slug][equals]=${slug}&depth=2`,
      {
        next: { revalidate: 60 }, // Revalidate data every 60 seconds
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch post data for slug "${slug}": ${res.status} ${res.statusText}`
      );
      // Có thể throw notFound() ở đây nếu muốn hiển thị trang 404
      // notFound(); // Nếu bạn muốn Next.js tự động chuyển hướng đến trang 404
      return null;
    }

    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (err) {
    console.error("Error fetching post for metadata:", err);
    return null;
  }
}

// Hàm generateMetadata cho trang chi tiết bài viết
export async function generatePostMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const postData = await getPostBySlug(params.slug);

  if (!postData) {
    return {
      title: "Bài viết không tìm thấy",
      description: "Bài viết bạn đang tìm kiếm không tồn tại.",
    };
  }

  const defaultTitle = "Default Blog Title";
  const defaultDescription = "Default description for the blog post.";
  const defaultImage = "/default-og-image.jpg"; // Ảnh mặc định trong thư mục public

  const seoTitle = postData.meta?.title || postData.title || defaultTitle;
  const seoDescription = postData.meta?.description || defaultDescription;
  const seoCanonical =
    postData.meta?.canonicalURL || `${SITE_URL}/posts/${params.slug}`;

  const seoImage =
    postData.meta?.image?.url || postData.heroImage?.url || defaultImage;

  let finalOgImageUrl: string;
  let finalTwitterImageUrl: string;

  // Logic để xây dựng URL ảnh tuyệt đối dựa trên nguồn ảnh
  if (seoImage.startsWith("/api/media/")) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
    finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
  } else if (seoImage.startsWith("/")) {
    // Nếu là đường dẫn tương đối trong thư mục public
    finalOgImageUrl = `${SITE_URL}${seoImage}`;
    finalTwitterImageUrl = `${SITE_URL}${seoImage}`;
  } else {
    // Trường hợp seoImage là ID hoặc tên file từ Payload (ví dụ: "filename.jpg" thay vì "/api/media/filename.jpg")
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
    finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
  }

  // Ưu tiên ảnh OG được cấu hình trong meta.image.sizes.og.url nếu có
  if (postData.meta?.image?.sizes?.og?.url) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${postData.meta.image.sizes.og.url}`;
  }

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: seoCanonical,
    },
    openGraph: {
      title: postData.meta?.ogTitle || seoTitle,
      description: postData.meta?.ogDescription || seoDescription,
      url: `${SITE_URL}/posts/${params.slug}`,
      type: "article",
      images: [
        {
          url: finalOgImageUrl,
          alt: postData.meta?.ogImage?.alt || seoTitle,
          width: postData.meta?.image?.sizes?.og?.width || undefined,
          height: postData.meta?.image?.sizes?.og?.height || undefined,
        },
      ],
      publishedTime: postData.publishedAt,
      modifiedTime: postData.updatedAt,
      authors: postData.populatedAuthors?.map((author) => author.name) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.meta?.twitterTitle || seoTitle,
      description: postData.meta?.twitterDescription || seoDescription,
      images: [
        {
          url: finalTwitterImageUrl,
          alt: postData.meta?.twitterImage?.alt || seoTitle,
          width: postData.meta?.image?.sizes?.og?.width || undefined,
          height: postData.meta?.image?.sizes?.og?.height || undefined,
        },
      ],
    },
  };
}
