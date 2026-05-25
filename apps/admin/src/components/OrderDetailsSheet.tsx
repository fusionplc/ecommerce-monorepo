"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { OrderType } from "@repo/types";

interface OrderDetailsSheetProps {
  order: OrderType | null;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsSheet = ({
  order,
  open,
  onClose,
}: OrderDetailsSheetProps) => {
  if (!order) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Order Info
            </h3>
            <div className="bg-secondary rounded-md p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs break-all">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    order.status === "pending" && "bg-yellow-500/40",
                    order.status === "success" && "bg-green-500/40",
                    order.status === "failed" && "bg-red-500/40",
                    order.status === "processing" && "bg-blue-500/40",
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Customer
            </h3>
            <div className="bg-secondary rounded-md p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{order.userId}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Products ({order.products?.length ?? 0})
            </h3>
            {order.products && order.products.length > 0 ? (
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-secondary rounded-md p-4 space-y-3 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{product.name}</span>
                      <span className="font-semibold">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Quantity</span>
                      <span>{product.quantity}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>
                        {formatCurrency(product.price * product.quantity)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground mb-1">
                        Shipping Address
                      </p>
                      <p>{product.shippingAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-secondary rounded-md p-4 text-sm text-muted-foreground">
                No products attached to this order.
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-secondary rounded-md p-4 flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-lg font-bold">
              {formatCurrency(order.amount)}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
