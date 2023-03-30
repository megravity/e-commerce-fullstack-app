import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import fileUpload from "express-fileupload";
import ImageCollection from "./models/imageSchema.js";
import stream from "stream";
// import cors from "cors";
import Stripe from "stripe";

dotenv.config();

export const stripe = Stripe(process.env.STRIPE_SECRET);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// app.use(cors({ origin: "http://localhost:5173", exposedHeaders: ["token"] }));

// app.use((_, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     next();
// });

app.use(express.static("views/dist"));

app.get("/", (req, res) => {
    res.sendFile("./views/dist/index.html", { root: "." });
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.get("/images/:filename", async (req, res) => {
    const image = await ImageCollection.findOne({
        filename: req.params.filename,
    });
    const readStream = stream.Readable.from(image.data);
    readStream.pipe(res);
});

mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log("Connection to DB established");
        app.listen(PORT, () => {
            console.log("Server listening on http://localhost:" + PORT);
        });
    })
    .catch((err) => {
        console.log("Error:", err.message);
    });
