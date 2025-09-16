import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await prisma.review.findMany({
    where: { productId: parseInt(productId) },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(reviews);
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { product: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(reviews);
});

export const getReviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, image: true } },
    },
  });
  if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
  res.status(200).json(review);
});

export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;
  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId: parseInt(productId) } },
  });
  if (existingReview) return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
  const review = await prisma.review.create({
    data: { userId, productId: parseInt(productId), rating: parseInt(rating), comment },
  });
  res.status(201).json(review);
});

export const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { rating, comment } = req.body;
  const review = await prisma.review.findUnique({ where: { id: parseInt(id) } });
  if (!review || review.userId !== userId) return res.status(404).json({ message: 'Không tìm thấy đánh giá hoặc không thuộc người dùng' });
  const updatedReview = await prisma.review.update({
    where: { id: parseInt(id) },
    data: { rating: rating ? parseInt(rating) : review.rating, comment: comment || review.comment },
  });
  res.status(200).json(updatedReview);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const review = await prisma.review.findUnique({ where: { id: parseInt(id) } });
  if (!review || review.userId !== userId) return res.status(404).json({ message: 'Không tìm thấy đánh giá hoặc không thuộc người dùng' });
  await prisma.review.delete({ where: { id: parseInt(id) } });
  res.status(200).json({ message: 'Xóa đánh giá thành công' });
});
