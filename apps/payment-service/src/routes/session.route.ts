import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import axios from "axios";

const sessionRoute = new Hono();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY as string;

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  // Calculate total amount in kobo (Paystack uses smallest currency unit)
  const totalAmount = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity * 100; // convert to kobo
  }, 0);

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: totalAmount,
        currency: "NGN",
        metadata: {
          userId,
          cart: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        callback_url: "http://localhost:3002/return",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } = response.data.data;
    return c.json({ authorization_url, reference });
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  }
});

// Verify transaction status by reference
sessionRoute.get("/:reference", async (c) => {
  const { reference } = c.req.param();

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const { status, gateway_response } = response.data.data;
    return c.json({
      status,
      paymentStatus: gateway_response,
    });
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  }
});

export default sessionRoute;