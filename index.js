const express = require("express");
const app = express();
const DB = require("./database").connectDB;

const userRouter = require("./routers/userRoutes");
const ownerRouter = require("./routers/ownerRoutes");
const productRouter = require("./routers/productRoutes");
const cartRouter = require("./routers/cartRoutes");
DB();

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", ownerRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening on port 3000");
});
