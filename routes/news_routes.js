import { Router } from "express";

const route=Router();


import {createNews,getNews,updateNews,deleteNews}  from "../controllers/news_controller.js";
import {authMiddleware} from "../middleware/auth_middleware.js"

route.post("/create-news",authMiddleware,createNews);
route.get("/get-news",authMiddleware,getNews);
route.put("/update-news/:id",authMiddleware,updateNews)
route.delete("/delete-news/:id",authMiddleware,deleteNews)

export default route;