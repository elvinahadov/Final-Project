import { Product } from "../models/productModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { PassThrough } from "stream";

export const createProduct = async (req, res) => {
  try {
    const requiredFields = [
      "name",
      "categoryId",
      "brandId",
      "description",
      "price",
      "inStock",
      "color",
      "productInfo",
      "onSale",
      "sale",
      "isBestseller",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    let productPhoto = {};
    if (req.file) {
      try {
        const passThroughStream = new PassThrough();
        passThroughStream.end(req.file.buffer);

        const result = await new Promise((resolve, reject) => {
          passThroughStream.pipe(
            cloudinary.uploader.upload_stream(
              { folder: "product_photos" },
              (error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            )
          );
        });

        productPhoto = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    const newProduct = new Product({
      name: req.body.name,
      categoryId: req.body.categoryId,
      brandId: req.body.brandId,
      description: req.body.description,
      productInfo: req.body.productInfo,
      price: req.body.price,
      inStock: req.body.inStock,
      productPhoto: productPhoto || null,
      color: req.body.color || "",
      onSale: req.body.onSale || false,
      sale: req.body.sale || 0,
      isBestseller: req.body.isBestseller || false,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: newProduct._id,
        name: newProduct.name,
        price: newProduct.price,
        inStock: newProduct.inStock,
        productPhoto: newProduct.productPhoto,
        color: newProduct.color,
        onSale: newProduct.onSale,
        sale: newProduct.sale,
        isBestseller: newProduct.isBestseller,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let productPhoto;

    // Zorunlu alan kontrolleri
    const requiredFields = ["name", "categoryId", "brandId"];
    for (let field of requiredFields) {
      if (!updates[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Yeni bir fotoğraf yüklenmişse
    if (req.file) {
      try {
        const passThroughStream = new PassThrough();
        passThroughStream.end(req.file.buffer);

        const result = await new Promise((resolve, reject) => {
          passThroughStream.pipe(
            cloudinary.uploader.upload_stream(
              { folder: "product_photos" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
          );
        });

        productPhoto = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };

        // Eski fotoğraf varsa, onu sil
        if (req.body.oldProductPhotoPublicId) {
          await cloudinary.uploader.destroy(req.body.oldProductPhotoPublicId);
        }
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    } else {
      // Yeni fotoğraf yoksa eski fotoğrafı koru
      const existingProduct = await Product.findById(id);
      if (existingProduct) {
        productPhoto = existingProduct.productPhoto;
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updates, productPhoto },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ürün resmini sil
    if (product.productPhoto?.public_id) {
      await cloudinary.uploader.destroy(product.productPhoto.public_id);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      brandId,
      categoryId,
      minPrice,
      maxPrice,
      bestsellers,
      onSale,
      sortBy,
      sortOrder,
    } = req.query;

    // Build filters based on query parameters
    let filter = {};
    if (brandId) filter.brandId = brandId;
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bestsellers === "true") filter.isBestseller = true;
    if (onSale === "true") filter.onSale = true;

    // Sort options
    let sort = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      if (sortBy === "price") {
        sort.price = order; // Sorting by price
      } else if (sortBy === "name") {
        sort.name = order; // Sorting by name
      }
    }

    const products = await Product.find(filter).sort(sort);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
