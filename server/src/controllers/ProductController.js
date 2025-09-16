import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image, size, color, categoryId } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : image;
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imagePath,
      size,
      color,
      categoryId: parseInt(categoryId),
    },
  });
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image, size, color, categoryId } = req.body;
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      description,
      price,
      stock,
      image,
      size,
      color,
      categoryId: parseInt(categoryId),
    },
  });
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});
