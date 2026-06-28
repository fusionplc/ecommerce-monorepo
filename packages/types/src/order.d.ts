import { OrderSchemaType } from "@repo/order-db";
export type OrderType = OrderSchemaType & {
    _id: string;
    email: string;
    products: {
        name: string;
        quantity: number;
        price: number;
        shippingAddress: string;
    }[];
};
export type OrderChartType = {
    month: string;
    total: number;
    successful: number;
};
//# sourceMappingURL=order.d.ts.map