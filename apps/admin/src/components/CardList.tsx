import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, ProductsType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";

const CardList = async ({ title }: { title: string }) => {
  let products: ProductsType = [];
  let orders: OrderType[] = [];
  const { getToken } = await auth();
  const token = await getToken();

  try {
    if (title === "Popular Products") {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`,
      );
      if (res.ok) products = await res.json();
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) orders = await res.json();
    }
  } catch (error) {
    console.error(`CardList fetch failed for "${title}":`, error);
    // Returns empty arrays, UI renders gracefully
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products" ? (
          products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            products.map((item) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={
                      Object.values(item.images as Record<string, string>)[0] ||
                      ""
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">${item.price}K</CardFooter>
              </Card>
            ))
          )
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders found.</p>
        ) : (
          orders.map((item) => (
            <Card
              key={item._id}
              className="flex-row items-center justify-between gap-4 p-4"
            >
              <CardContent className="flex-1 p-0">
                <CardTitle className="text-sm font-medium">
                  {item.email}
                </CardTitle>
                <Badge variant="secondary">{item.status}</Badge>
              </CardContent>
              <CardFooter className="p-0">${item.amount / 100}</CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CardList;
