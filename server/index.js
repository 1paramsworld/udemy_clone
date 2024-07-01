import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import authroutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRouter from "./routes/product.js";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json());
const port = process.env.PORT || 8000;
const url = process.env.URL;
app.use(cors())
app.use(morgan('dev'));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("db connected");
})
.catch((err) => {
    console.error("db connection error:", err);
});


app.use("/api", authroutes);
app.use("/api", categoryRoutes);
app.use("/api", productRouter);

app.listen(port, () => {
    console.log(port)
    console.log(`listening to port ${port}`);
});
