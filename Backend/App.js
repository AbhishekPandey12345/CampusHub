import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// routes
import router from "./Routes/user.route.js";
app.use("/users", router);

export { app };