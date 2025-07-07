export interface Author {
  id: string;
  name: string;
}

export interface HeroImageSize {
  width: number | null;
  height: number | null;
  mimeType: string | null;
  filesize: number | null;
  filename: string | null;
  url: string | null;
}

export interface HeroImage {
  id: string;
  alt: string;
  thumbnailURL: string;
  url: string;
  sizes: {
    thumbnail: HeroImageSize;
    square: HeroImageSize;
    small: HeroImageSize;
    medium: HeroImageSize;
    large: HeroImageSize;
    xlarge: HeroImageSize;
    og: HeroImageSize;
  };
}

export interface RichTextChild {
  type: string;
  text?: string;
  children?: RichTextChild[];
}

export interface PostType {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  populatedAuthors?: Author[];
  heroImage?: HeroImage;
  content?: {
    root: {
      children: RichTextChild[];
    };
  };
  hearts?: number;
}
