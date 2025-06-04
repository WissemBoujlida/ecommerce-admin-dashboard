import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>;
}) {
  const { storeId, categoryId } = await params;

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
      storeId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={category} billboards={billboards} />
      </div>
    </div>
  );
}
