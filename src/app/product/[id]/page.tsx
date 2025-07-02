import ProductPageClient from '@/components/features/products/ProductPageClient';

interface ProductParams {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';   // SSR em toda visita

export default async function ProductPage({ params }: ProductParams) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
