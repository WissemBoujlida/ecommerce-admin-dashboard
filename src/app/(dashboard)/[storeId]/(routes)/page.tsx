import { CreditCard, DollarSign, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { calculateSalesCount } from "@/actions/calculate-sales";
import { calculateTotalRevenue } from "@/actions/calculate-total-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { priceFormatter } from "@/lib/utils";
import { getRevenueGraphData } from "@/actions/get-revenue-graph-data";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  const totalRevenue = await calculateTotalRevenue(storeId);
  const salesCount = await calculateSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphData = await getRevenueGraphData(storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {priceFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Products In Stock
              </CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardContent className="pl-2">
              <Overview data={graphData} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
