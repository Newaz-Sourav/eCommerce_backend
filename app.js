const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/indexRouter");
const orderRouter = require("./routes/orderRouter");
const cors = require('cors');

app.use(cors({
  origin: true, 
  credentials: true, 
}));

const db = require("./config/mongoose_connection");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
db();


//manage routerss
app.use("/",indexRouter);
app.use("/owner",ownerRouter);
app.use("/user",userRouter);
app.use("/products",productsRouter);
app.use("/order",orderRouter);

app.listen(3000);