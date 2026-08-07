import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-fg-faint">
          <Link href="/" className="hover:text-fg-muted">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-fg-muted">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-fg-muted">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>
      </Container>

      <RelatedProducts products={related} />
    </div>
  );
}
