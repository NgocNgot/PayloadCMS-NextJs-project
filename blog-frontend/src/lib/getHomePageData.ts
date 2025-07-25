import { HomePageType } from "../types/Home";

const PAYLOAD_SERVER_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getHomePageData(): Promise<HomePageType | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_SERVER_URL}/api/pages?where[slug][equals]=home&depth=2`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch homepage data: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const data = await res.json();
    if (data.docs.length === 0) return null;
    return data.docs[0];
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null;
  }
}
