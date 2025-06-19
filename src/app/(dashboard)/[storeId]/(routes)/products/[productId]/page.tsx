import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) {
  const { storeId, productId } = await params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
      storeId,
    },
    include: {
      images: true,
    },
  });

  const formattedProduct = product
    ? { ...product, price: parseFloat(String(product.price)) }
    : null;

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          product={formattedProduct}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
}
