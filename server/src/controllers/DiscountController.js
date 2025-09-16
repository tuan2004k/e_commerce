import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getDiscounts = asyncHandler(async (req, res) => {
  const discounts = await prisma.discount.findMany();
  res.status(200).json(discounts);
});

export const getDiscountById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const discount = await prisma.discount.findUnique({ where: { id: parseInt(id) } });
  if (!discount) return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
  res.status(200).json(discount);
});

export const createDiscount = asyncHandler(async (req, res) => {
  const { code, description, percentage, fixedAmount, startDate, endDate } = req.body;
  const discount = await prisma.discount.create({
    data: {
      code,
      description,
      percentage,
      fixedAmount,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });
  res.status(201).json(discount);
});

export const updateDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, description, percentage, fixedAmount, startDate, endDate } = req.body;
  const discount = await prisma.discount.update({
    where: { id: parseInt(id) },
    data: {
      code,
      description,
      percentage,
      fixedAmount,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });
  res.status(200).json(discount);
});

export const deleteDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.discount.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});
