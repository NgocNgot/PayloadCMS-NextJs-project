export interface HomePageType {
    id: string;
    title: string;
    slug: string;
    updatedAt: string;
    hero?: {
        type: 'fullscreen' | 'halfscreen' | 'none';
        media?: {
            url: string;
            alt?: string;
        };
        heading?: string;
        subheading?: string;
    };
    layout?: any[];
    meta?: {
        title?: string;
        description?: string;
        keywords?: string;
        image?: { url: string; alt?: string; };
        canonicalURL?: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: { url: string; alt?: string; };
        twitterTitle?: string;
        twitterDescription?: string;
        twitterImage?: { url: string; alt?: string; };
        schemaMarkup?: any;
    };
}