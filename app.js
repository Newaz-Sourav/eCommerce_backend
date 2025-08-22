const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Routers
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/indexRouter");
const orderRouter = require("./routes/orderRouter");

// Database
const db = require("./config/mongoose_connection");
db();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", indexRouter);
app.use("/owner", ownerRouter);
app.use("/user", userRouter);
app.use("/products", productsRouter);
app.use("/order", orderRouter);

// Listen on Render's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
