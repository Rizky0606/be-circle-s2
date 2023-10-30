import { v2 as cloudinary } from "cloudinary";

export default new (class Cloudinary {
  upload() {
    cloudinary.config({
      cloud_name: process.env.APP_CLOUD_NAME,
      api_key: process.env.APP_API_KEY,
      api_secret: process.env.APP_API_SECRET,
    });
  }

  async destination(image: any) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        "src/uploads/" + image,
        {
          folder: "Circle-Dumbways",
        }
      );
      return cloudinaryResponse.secure_url;
    } catch (error) {
      throw error;
    }
  }
})();
