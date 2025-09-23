import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  let productData;
  try {
      productData = JSON.parse(req.body.productData);
      console.log("Server - Parsed productData for create:", productData);
  } catch (error) {
      console.error("Server - Error parsing productData for create:", error);
      return res.status(400).json({ message: "Invalid product data format." });
  }

  const { name, description, price, stock, size, color, categoryId } = productData;
  
  let imagePath = null;
  if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("Server - New image uploaded for create:", imagePath);
  }

  const newProductData = {
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    image: imagePath,
    size,
    color,
    categoryId: parseInt(categoryId),
  };
  console.log("Server - Data to create in Prisma:", newProductData);

  const product = await prisma.product.create({
    data: newProductData,
    include: { category: true }, // Keep include for response if desired
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Server - Product ID from params:", id);
  let productData;
  try {
      productData = JSON.parse(req.body.productData);
      console.log("Server - Parsed productData:", productData);
  } catch (error) {
      console.error("Server - Error parsing productData:", error);
      return res.status(400).json({ message: "Invalid product data format." });
  }

  const { name, description, price, stock, size, color, categoryId } = productData;

  let imagePath = req.body.image; // Assume existing image if no new one is uploaded
  if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("Server - New image uploaded:", imagePath);
  } else if (productData.image === null) {
      // If client explicitly sent image: null, remove image
      imagePath = null;
      console.log("Server - Image explicitly set to null.");
  } else {
      console.log("Server - Retaining existing image path:", imagePath);
  }

  const dataToUpdate = {
    name,
    description,
    price: parseFloat(price),
    stock: parseInt(stock),
    image: imagePath,
    size,
    color,
    categoryId: parseInt(categoryId),
  };
  console.log("Server - Data to update in Prisma:", dataToUpdate);

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: dataToUpdate,
    include: { category: true },
  });

  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});
