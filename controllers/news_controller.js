import prisma from "../config/db_config.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { uploadFilesToCloudinary } from "../utils/imageUploader.js";
import {getCache,setCache} from "../utils/cache.js"
import logger from "../config/logger.js"

export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newsImage = req.files.newsImage;

    //check if news already exits or not

    const newsExits = await prisma.news.findFirst({
      where: {
        title: title,
      },
    });
    if (newsExits) {
      return errorResponse(res, "News already exists", 400);
    }

    const newsImg = await uploadFilesToCloudinary(
      newsImage,
      process.env.FOLDER_NAME
    );

    console.log(newsImg.secure_url);

    const news = await prisma.news.create({
      data: {
        title,
        content,
        image: newsImg.secure_url,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    successResponse(res, news, "News created successfully", 200);
  } catch (error) {
    logger.error(error?.message);
    errorResponse(res, error.message, "Error in createNews controller", 500);
  }
};

export const getNews = async (req, res) => {
  try {
   
    const cacheKey="all_news";
    const cachedNews=await getCache(cacheKey);
    if(cachedNews){
      return successResponse(res,cachedNews,"News fetched successfully",200);
    }

    const news = await prisma.news.findMany({
    //  where:{
    //   title:{
    //     contains:"T20"
    //   }
    //  }

    // where:{
    //   id:{
    //     in:[2,4]
    //   }
    // }
    
    // orderBy:{
    //   createdAt:"desc"
    // }

    });

    await setCache(cacheKey,news)
    successResponse(res, news, "News fetched successfully", 200);
  

  } catch (error) {
    logger.error(error?.message);
    errorResponse(res, error.message, "Error in getNews controller", 500);
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, content } =req.body;
    const NewsImage = req.files.NewsImage;
    const id = req.params.id;
    if (!title || !content) {
      return errorResponse(res, "Invalid request", 400);
    }

    const newsImg = uploadFilesToCloudinary(NewsImage, process.env.FOLDER_NAME);

    const news = await prisma.news.update({
      where: {
        id:Number(id),
      },
      data: {
        title,
        content,
        image: newsImg.secure_url,
        user:{
          connect:{
            id:req.user.id
          }
        }
      }
    });

    successResponse(res, news, "News updated successfully", 200);
  } catch (error) {
    logger.error(error?.message);
    
    errorResponse(res, error.message, "Error in updateNews controller", 500);
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news_id = req.params.id;
    console.log(news_id);

    const news = await prisma.news.delete({
      where: {
        id: Number(news_id),
      },
    });

    successResponse(res, "News deleted successfully", 200);
  } catch (error) {
    logger.error(error?.message);
    errorResponse(res, error.message, "Error in deleteNews controller", 500);
  }
};
