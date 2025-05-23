"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ProductRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    if (productId) {
      // Redirect to dynamic route path
      router.replace(`/product/${productId}`);
    } else {
      // If no ID, redirect to shop page
      router.replace('/shop');
    }
  }, [productId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  );
}

export default function ProductRedirect() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <ProductRedirectContent />
    </Suspense>
  );
}
