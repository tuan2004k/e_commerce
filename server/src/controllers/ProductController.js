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

  let productData;
  try {
    productData = JSON.parse(req.body.productData);
  } catch (error) {
    console.error("Server - Error parsing productData for update:", error);
    return res.status(400).json({ message: "Invalid product data format." });
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found." });
  }

  const { name, description, price, stock, size, color, categoryId } = productData;

  let imagePath = existingProduct.image;

  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  } else if (productData.image === null) {
    imagePath = null;
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
