import { Brand } from "../models/brandModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import stream from "stream";

export const addBrand = async (req, res) => {
  const { name } = req.body;
  const logo = req.file;

  if (!name || !logo) {
    return res.status(400).json({ message: "Name and logo are required." });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res
            .status(500)
            .json({ message: "Error uploading to Cloudinary" });
        }

        const newBrand = await Brand.create({
          name,
          public_id: result.public_id,
          secure_url: result.secure_url,
        });

        res
          .status(201)
          .json({ message: "Brand added successfully", brand: newBrand });
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(logo.buffer); // End the stream with the file buffer
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};

export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const publicId = brand.secure_url.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    await Brand.findByIdAndDelete(id);

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Failed to delete brand" });
  }
};
