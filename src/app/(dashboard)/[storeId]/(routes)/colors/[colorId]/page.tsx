import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

export default async function ColorPage({
  params,
}: {
  params: Promise<{ storeId: string; colorId: string }>;
}) {
  const { storeId, colorId } = await params;

  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
}
