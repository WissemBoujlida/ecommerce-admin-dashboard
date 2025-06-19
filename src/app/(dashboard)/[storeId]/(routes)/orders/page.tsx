import { format } from "date-fns";

import { OrdersClient } from "./components/orders-client";
import { OrderColumn } from "./components/columns";
import prismadb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    products: order.items.map((item) => item.product.name).join(", "),
    totalPrice: priceFormatter.format(
      order.items
        .map((item) => parseFloat(String(item.product.price)))
        .reduce((a, b) => a + b, 0),
    ),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
}
