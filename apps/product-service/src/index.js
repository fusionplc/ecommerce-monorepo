import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { consumer, producer, createTopics } from "./utils/kafka.js";
dotenv.config();
const app = express();
app.use(cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
}));
app.use(express.json());
app.use(clerkMiddleware());
app.get("/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});
app.get("/test", shouldBeUser, (req, res) => {
    res.json({ message: "Product service authenticated", userId: req.userId });
});
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use((err, req, res, next) => {
    console.log(err);
    return res
        .status(err.status || 500)
        .json({ message: err.message || "Internal Server Error!" });
});
const start = async () => {
    try {
        await Promise.all([
            createTopics(),
            producer.connect(),
            consumer.connect(),
        ]);
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Product service is running on ${process.env.PORT || 8000}`);
        });
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
start();
