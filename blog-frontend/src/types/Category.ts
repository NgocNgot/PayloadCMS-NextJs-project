export interface CategoryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  slugLock: boolean;
  breadcrumbs: Array<{
    doc: string;
    url: string;
    label: string;
    id: string;
  }>;
}
