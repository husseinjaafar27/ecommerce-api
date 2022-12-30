const express = require("express");
const app = express();
const DB = require("./database").connectDB;

const ownerRouter = require("./routers/ownerRoutes");
const productRouter = require("./routers/productRoutes");
const cartRouter = require("./routers/cartRoutes");
const orderRouter = require("./routers/orderRoutes");
DB();

app.use(express.json());
app.use("/api", ownerRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening on port 3000");
});
