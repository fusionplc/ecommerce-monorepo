import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import { OrderChartType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

const Homepage = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  let orderChartData: OrderChartType[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/order-chart`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (res.ok) {
      orderChartData = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch order chart data:", err);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart data={orderChartData} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <CardList title="Latest Transactions" />
        </Suspense>
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <CardList title="Popular Products" />
        </Suspense>
      </div>
    </div>
  );
};

export default Homepage;
