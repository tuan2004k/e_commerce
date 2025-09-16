import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (userId, discountId, orderItems) => {
  let total = 0;
  const validOrderItems = [];

  for (const item of orderItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.quantity) {
      throw new Error(`Invalid product or insufficient stock for product ID ${item.productId}`);
    }
    total += product.price * item.quantity;
    validOrderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
  }

  let discountAmount = 0;
  if (discountId) {
    const discount = await prisma.discount.findUnique({ where: { id: discountId } });
    if (!discount || (discount.endDate && discount.endDate < new Date())) {
      throw new Error('Invalid or expired discount code');
    }
    if (discount.percentage) {
      discountAmount = total * (discount.percentage / 100);
    } else if (discount.fixedAmount) {
      discountAmount = discount.fixedAmount;
    }
    total -= discountAmount;
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      discountId,
      orderItems: {
        create: validOrderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  for (const item of validOrderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
  return order;
};

export const getOrdersByUserId = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderDetailsById = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: { orderItems: { include: { product: true } }, discount: true },
  });
  if (!order || order.userId !== userId) {
    return null;
  }
  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  return prisma.order.update({
    where: { id: parseInt(orderId) },
    data: { status },
  });
};
