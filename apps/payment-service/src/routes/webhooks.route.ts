import { Hono } from "hono";
import { createHmac } from "crypto";
import { producer } from "../utils/kafka";

const webhookSecret = process.env.PAYSTACK_SECRET_KEY as string;
const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

webhookRoute.post("/paystack", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("x-paystack-signature");

  // Verify webhook signature using HMAC SHA512
  const hash = createHmac("sha512", webhookSecret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.log("Webhook verification failed!");
    return c.json({ error: "Webhook verification failed!" }, 400);
  }

  const event = JSON.parse(body);

  switch (event.event) {
    case "charge.success":
      const data = event.data;
      producer.send("payment.successful", {
        value: {
          userId: data.metadata?.userId,
          email: data.customer?.email,
          amount: data.amount, // in kobo
          status: data.status === "success" ? "success" : "failed",
          products: data.metadata?.cart?.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });
      break;
    default:
      break;
  }

  return c.json({ received: true });
});

export default webhookRoute;