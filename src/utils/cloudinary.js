import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const fileUploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const cloudinaryRespons = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // successfully file upload in cloudinary
    // console.log(
    //   "successfully file upload in cloudinary",
    //   cloudinaryRespons.url
    // );
    fs.unlinkSync(localFilePath);
    return cloudinaryRespons;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the local saved temporary as the upload operation got faild
    console.log("Error on the fileUploadOnCloudinary function", error);
    return null;
  }
};

export { fileUploadOnCloudinary };
