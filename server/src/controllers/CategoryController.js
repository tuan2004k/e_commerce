import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res
    .status(200)
    .json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) }
  });
  if (!category)
    return res.status(404).json({
      message: 'Không tìm thấy danh mục'
    });
  res.status(200).json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await prisma.category.create(
    {
      data: { name }
    }
  );
  res.status(201)
    .json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await prisma.category.update(
    {
      where: { id: parseInt(id) },
      data: { name }
    }
  );
  res.status(200).json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete(
    {
      where: {
        id: parseInt(id)
      }
    }
  );
  res.status(204).send();
});
