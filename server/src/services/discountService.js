import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDiscounts = async () => {
  return prisma.discount.findMany();
};

export const getDiscountById = async (id) => {
  return prisma.discount.findUnique({ where: { id: parseInt(id) } });
};

export const createDiscount = async (discountData) => {
  return prisma.discount.create({ data: discountData });
};

export const updateDiscount = async (id, discountData) => {
  return prisma.discount.update({ where: { id: parseInt(id) }, data: discountData });
};

export const deleteDiscount = async (id) => {
  return prisma.discount.delete({ where: { id: parseInt(id) } });
};
