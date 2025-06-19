import { format } from "date-fns";

import { ProductsClient } from "./components/products-client";
import { ProductColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const products = await prismadb.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: priceFormatter.format(parseFloat(String(product.price))),
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
}
