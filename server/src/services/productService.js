import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({ where: { id: parseInt(id) } });
};

export const createProduct = async (productData) => {
  return prisma.product.create({ data: productData });
};

export const updateProduct = async (id, productData) => {
  return prisma.product.update({ where: { id: parseInt(id) }, data: productData });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({ where: { id: parseInt(id) } });
};
