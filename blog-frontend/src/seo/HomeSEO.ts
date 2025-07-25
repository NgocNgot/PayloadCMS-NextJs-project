import { Metadata } from "next";
import { getHomePageData } from "@/lib/getHomePageData";
const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const homepageData = await getHomePageData();

  const defaultTitle = "Default Blog Title";
  const defaultDescription = "Default description for the homepage.";
  const defaultImage = "/default-og-image.jpg";

  const seoTitle = homepageData?.meta?.title || defaultTitle;
  const seoDescription = homepageData?.meta?.description || defaultDescription;
  const seoKeywords = homepageData?.meta?.keywords;
  const seoCanonical = homepageData?.meta?.canonicalURL || SITE_URL;
  const seoImage =
    homepageData?.meta?.image?.url ||
    homepageData?.hero?.media?.url ||
    defaultImage;

  let finalOgImageUrl: string;
  let finalTwitterImageUrl: string;

  if (homepageData?.meta?.image?.url) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${homepageData.meta.image.url}`;
  } else if (seoImage.startsWith("/api/media/")) {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}${seoImage}`;
  } else if (seoImage.startsWith("/")) {
    finalOgImageUrl = `${SITE_URL}${seoImage}`;
  } else {
    finalOgImageUrl = `${PAYLOAD_SERVER_URL}/api/media/file/${seoImage}`;
  }

  if (homepageData?.meta?.twitterImage?.url) {
    finalTwitterImageUrl = `${PAYLOAD_SERVER_URL}${homepageData.meta.twitterImage.url}`;
  } else {
    finalTwitterImageUrl = finalOgImageUrl;
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords ? seoKeywords.split(",").map((k) => k.trim()) : [],
    alternates: {
      canonical: seoCanonical,
    },
    openGraph: {
      title: homepageData?.meta?.ogTitle || seoTitle,
      description: homepageData?.meta?.ogDescription || seoDescription,
      url: SITE_URL,
      type: "website",
      images: [
        {
          url: finalOgImageUrl,
          alt: homepageData?.meta?.ogImage?.alt || seoTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homepageData?.meta?.twitterTitle || seoTitle,
      description: homepageData?.meta?.twitterDescription || seoDescription,
      images: [
        {
          url: finalTwitterImageUrl,
          alt: homepageData?.meta?.twitterImage?.alt || seoTitle,
        },
      ],
    },
  };
}
