import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import "dotenv/config"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

cloudinary.api.ping()
    .then(res => console.log("Cloudinary OK:", res))
    .catch(err => console.error("Cloudinary FAILED:", err));

const uploadOnCloudinary = async (localfilePath) => {
    try {

        if (!localfilePath) return null
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto", // This will automatically detect the file type (image, video, etc.)
        });

        //unlink the files now
        fs.unlinkSync(localfilePath)

        return response; // Return the uploaded file details
    } catch (error) {
        try {
            if (localfilePath) fs.unlinkSync(localfilePath); // Delete the file from local storage if it still exists
        } catch (unlinkError) {
            // File may have already been deleted or never saved — safe to ignore
            console.warn("Could not delete temp file:", unlinkError.message);
        }
        console.error("Cloudinary upload failed:", {
            status: error.http_code,
            message: error.error?.message || error.message,
            name: error.name,
        });
    }
}

export { uploadOnCloudinary };