import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

export default async function BillboardPage({
  params,
}: {
  params: Promise<{ storeId: string; billboardId: string }>;
}) {
  const { storeId, billboardId } = await params;

  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm billboard={billboard} />
      </div>
    </div>
  );
}
