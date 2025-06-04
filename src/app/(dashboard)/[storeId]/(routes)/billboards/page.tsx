import { format } from "date-fns";
import { Billboard } from "@prisma/client";

import { BillboardsClient } from "./components/billboards-client";
import { BillboardColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";

export default async function BillboardsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const billboards: Billboard[] = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    }),
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsClient data={formattedBillboards} />
      </div>
    </div>
  );
}
