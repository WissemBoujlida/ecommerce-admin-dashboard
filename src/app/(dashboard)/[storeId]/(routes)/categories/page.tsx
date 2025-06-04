import { format } from "date-fns";

import { CategoriesClient } from "./components/categories-client";
import { CategoryColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      billboard: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
}
