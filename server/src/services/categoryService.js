import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({ where: { id: parseInt(id) } });
};

export const createCategory = async (categoryData) => {
  return prisma.category.create({ data: categoryData });
};

export const updateCategory = async (id, categoryData) => {
  return prisma.category.update({ where: { id: parseInt(id) }, data: categoryData });
};

export const deleteCategory = async (id) => {
  return prisma.category.delete({ where: { id: parseInt(id) } });
};
