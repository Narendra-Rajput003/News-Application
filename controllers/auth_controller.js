import prisma from "../config/db_config.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { uploadFilesToCloudinary } from "../utils/imageUploader.js";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import {EmailSender} from "../utils/mailSender.js"
import logger from "../config/logger.js";



const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUp = async (req, res) => {
  try {
    //The parse method from Zod not only validates the input data but also parses and transforms it according to the defined schema. This means that the returned object will have the same shape as the schema, with the properties correctly typed and transformed (if necessary).

    const { name, email, password } = signUpSchema.parse(req.body);
    const displayPicture = req.files.displayPicture;

    // Basic input validation
    if (!name || !email || !password) {
      return errorResponse(res, null, "All fields are required", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where:{
        OR:[
          {name},
          {email}
        ]
      }
    })

    if (existingUser) {
      return errorResponse(res, null, "User already exists", 409);
    }

    // Upload image to Cloudinary
    const uploadImageUrl = await uploadFilesToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME
    );
    if (!uploadImageUrl || !uploadImageUrl.secure_url) {
      return errorResponse(res, null, "Error uploading image", 500);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profileImage: uploadImageUrl.secure_url,
      },
    });

    return successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, null, error.errors[0].message, 400);
    }
    console.error(error);
    return errorResponse(res, error, "Error in Signup Controller");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return errorResponse(res, null, "User does not exist", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return errorResponse(res, null, "Incorrect password", 401);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie('token',token,options)



    return successResponse(res,null,`Bearer ${token}`,200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(res, null, error.errors[0].message, 400);
    }
    errorResponse(res, error, "Error in login controller");
  }
};


export const sendEmail=async(req,res)=>{
  try {
    const {email}=req.query;
    if(!email){
      return errorResponse(res,null,"Email is required",400);
    }

      await EmailSender(email,'Test Demo',"<h1>Hello Word from Backend Master</h1>")
   

    return successResponse(res,null,"Email Sent Successfully",200);

    
  } catch (error) {
    logger.error({
      type:"Email Error",
      message:error.message,
     
    })
    errorResponse(res, error, "Error in email controller");
    
  }
}




