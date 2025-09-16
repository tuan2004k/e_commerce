import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReviewsByProductId = async (productId) => {
  return prisma.review.findMany({
    where: { productId: parseInt(productId) },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReviewsByUserId = async (userId) => {
  return prisma.review.findMany({
    where: { userId },
    include: { product: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReviewDetailsById = async (id) => {
  return prisma.review.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, image: true } },
    },
  });
};

export const createReview = async (userId, productId, rating, comment) => {
  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: parseInt(productId),
      },
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this product.');
  }

  return prisma.review.create({
    data: {
      userId,
      productId: parseInt(productId),
      rating: parseInt(rating),
      comment,
    },
  });
};

export const updateReview = async (id, userId, rating, comment) => {
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review || review.userId !== userId) {
    throw new Error('Review not found or does not belong to user');
  }

  return prisma.review.update({
    where: { id: parseInt(id) },
    data: {
      rating: rating ? parseInt(rating) : review.rating,
      comment: comment || review.comment,
    },
  });
};

export const deleteReview = async (id, userId) => {
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review || review.userId !== userId) {
    throw new Error('Review not found or does not belong to user');
  }

  await prisma.review.delete({ where: { id: parseInt(id) } });
  return true;
};
