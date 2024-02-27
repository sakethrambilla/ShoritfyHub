const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const urlRoute = require("./routes/urlRoutes");
const userRoute = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;

connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => [res.json({ message: "Welcome to Backend" })]);

app.use("/url", urlRoute);
app.use("/user", userRoute);

app.use(errorHandler);
app.listen(port, () => console.log(`Server started at PORT : ${port}`));
