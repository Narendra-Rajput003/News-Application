import prisma from "../config/db_config.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { uploadFilesToCloudinary } from "../utils/imageUploader.js";
import bcrypt from "bcrypt";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    successResponse(res, user, "User profile fetch successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, "Error in getProfile ", 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = updateProfileSchema.parse(req.body);
    const user = req.user;
    const updateProfileImage = req.files.updateProfileImage;

    const exitsUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!exitsUser) {
      errorResponse(res, "User not found", "Error in updateProfile", 404);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const profileImage = await uploadFilesToCloudinary(
      updateProfileImage,
      process.env.FOLDER_NAME
    );
    const updatedUser = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
        password: hashedPassword,
        profileImage: profileImage.secure_url,
      },
    });
    successResponse(res, updatedUser, "User update successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, "Error in updateProfile", 500);
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = req.user;
    const deleteUser = await prisma.users.delete({
      where: {
        id: user.id,
      },
    });
    successResponse(res, deleteUser, "User deleted successfully", 200);
  } catch (error) {
    errorResponse(res, error.message, "Error in deleteProfile", 500);
  }
};

export const allUsersProfiles = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });
    return successResponse(res, users, "All users fetched successfully", 200);
  } catch (error) {
    errorResponse(res, error, "Error in fetching all users", 500);
  }
};
