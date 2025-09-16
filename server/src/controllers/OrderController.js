import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { discountId, orderItems } = req.body;
  let total = 0;
  const validOrderItems = [];
  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId
      }
    });
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({
        message: `Sản phẩm không hợp lệ hoặc không đủ hàng (ID ${item.productId})`
      });
    }
    total += product.price * item.quantity;
    validOrderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price
    });
  }

  let discountAmount = 0;
  if (discountId) {
    const discount = await prisma.discount.findUnique({ where: { id: discountId } });
    if (!discount || (discount.endDate && discount.endDate < new Date())) {
      return res.status(400).json(
        {
          message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
        });
    }
    if (discount.percentage) discountAmount = total * (discount.percentage / 100);
    else if (discount.fixedAmount) discountAmount = discount.fixedAmount;
    total -= discountAmount;
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      discountId,
      orderItems: {
        create: validOrderItems.map(item => (
          {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
      },
    },
    include:
    {
      orderItems: true
    },
  });

  for (const item of validOrderItems) {
    await prisma.product.update(
      {
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      }
    );
  }

  res.status(201).json(order);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where:
    {
      userId
    },
    include:
    {
      orderItems: { include: { product: true } }
    },
    orderBy:
    {
      createdAt: 'desc'
    },
  });
  res.status(200).json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const order = await prisma.order.findUnique(
    {
      where: { id: parseInt(id) },
      include: {
        orderItems: { include: { product: true } },
        discount: true
      }
    });
  if (!order || order.userId !== userId) return res.status(404).json(
    {
      message: 'Không tìm thấy đơn hàng hoặc không thuộc người dùng'
    });
  res.status(200).json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await prisma.order.findUnique(
    {
      where: { id: parseInt(id) }
    }
  );
  if (!order) return res.status(404).json(
    {
      message: 'Không tìm thấy đơn hàng'
    }
  );
  const updatedOrder = await prisma.order.update(
    {
      where: { id: parseInt(id) }, data: { status }
    }
  );
  res.status(200).json(updatedOrder);
});
