import prismadb from "@/lib/prismadb";

export const calculateTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    return (
      total +
      order.items.reduce(
        (orderTotal, item) => orderTotal + item.product.price.toNumber(),
        0
      )
    );
  }, 0);

  return totalRevenue;
};
