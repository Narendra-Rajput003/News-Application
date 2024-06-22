import { v2 as cloudinary } from "cloudinary";

export const uploadFilesToCloudinary = async (file, folder) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const isImage = file.mimetype.startsWith("image/");
    const options = {
      folder,
      resource_type: isImage ? 'image' : 'video',
    };

    if (isImage) {
      options.transformation = [
        { gravity: 'face', crop: 'thumb', width: 200, height: 200, radius: 'max' }, // auto-crop to square aspect_ratio
        { format: 'auto', quality: 'auto', fetch_format: 'auto' } // optimize delivery by resizing and applying auto-format and auto-quality
      ];
    } else {
      // For videos, do not apply transformations that reduce quality
      options.transformation = [
        { format: 'auto', quality: 'auto:best', fetch_format: 'auto' } // optimize delivery
      ];
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};
