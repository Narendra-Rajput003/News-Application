import express, { urlencoded } from "express";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectQeue from "./config/queue-config.js"

import cloudinaryConnect from "./config/cloudinary.js";
import authRoutes from "./routes/auth_route.js";
import profileRoutes from "./routes/profile_route.js";
import newsRoutes from "./routes/news_routes.js";
import rateLimiter from "./middleware/rateLimiter.js";



const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(rateLimiter);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`Server runnning at port ${PORT}`);
  connectQeue
  console.log("queue is connected")
});
