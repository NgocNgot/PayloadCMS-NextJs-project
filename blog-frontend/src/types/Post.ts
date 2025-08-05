import { CommentType } from "./Comment";

export interface Author {
  id: string;
  name: string;
}

export interface ImageSize {
  width: number | null;
  height: number | null;
  mimeType: string | null;
  filesize: number | null;
  filename: string | null;
  url: string | null;
}

export interface Image {
  id: string;
  alt: string;
  thumbnailURL: string;
  url: string;
  sizes: {
    thumbnail: ImageSize;
    square: ImageSize;
    small: ImageSize;
    medium: ImageSize;
    large: ImageSize;
    xlarge: ImageSize;
    og: ImageSize;
  };
  createdAt?: string;
  updatedAt?: string;
  focalX?: number;
  focalY?: number;
}

export interface RichTextChild {
  type: string;
  text?: string;
  children?: RichTextChild[];
  format?: number;
  detail?: number;
  mode?: string;
  style?: string;
  tag?: string;
}

export interface PostMeta {
  title?: string;
  description?: string;
  image?: Image;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Image;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: Image;
}

export interface PostType {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  populatedAuthors?: Author[];
  heroImage?: Image;
  content?: {
    root: {
      children: RichTextChild[];
      direction?: string | null;
      format?: string;
      indent?: number;
      type?: string;
      version?: number;
    };
  };
  hearts?: number;
  comments?: CommentType[];
  createdAt: string;
  updatedAt: string;
  _status: "draft" | "published";
  slugLock?: boolean;
  meta?: PostMeta;
  categories?: {
    id: string;
    title: string;
    slug: string;
    slugLock?: boolean;
    breadcrumbs?: Array<{
      doc: string;
      url: string;
      label: string;
      id: string;
    }>;
    createdAt?: string;
    updatedAt?: string;
  }[];
}
