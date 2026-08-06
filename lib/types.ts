export type Category =
  | "Running"
  | "Basketball"
  | "Lifestyle"
  | "Training"
  | "Skate"
  | "Slides";

export type ColorSwatch = {
  name: string;
  hex: string;
};

export type ProductArt = {
  upper: string;
  sole: string;
  accent: string;
  laces: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  sizes: number[];
  colors: ColorSwatch[];
  art: ProductArt;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CartItem = {
  productId: string;
  size: number;
  color: string;
  quantity: number;
};
