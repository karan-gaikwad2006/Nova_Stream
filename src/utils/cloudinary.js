import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilePath) => {
    try {
        
        if(!localfilePath) return null
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localfilePath,{
            resource_type: "auto", // This will automatically detect the file type (image, video, etc.)
        });

        //unlink the files now
        fs.unlinkSync(localfilePath)

        return response; // Return the uploaded file details
    } catch (error) {
        fs.unlinkSync(localfilePath); // Delete the file from local storage after uploading to Cloudinary
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}

export { uploadOnCloudinary };