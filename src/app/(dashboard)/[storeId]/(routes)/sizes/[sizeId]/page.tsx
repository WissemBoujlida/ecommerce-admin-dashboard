import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

export default async function SizePage({
  params,
}: {
  params: Promise<{ storeId: string; sizeId: string }>;
}) {
  const { storeId, sizeId } = await params;

  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
}
