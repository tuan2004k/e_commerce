import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCartByUserId = async (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const addOrUpdateCartItem = async (userId, productId, quantity) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  let cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: parseInt(productId) } },
  });

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + quantity },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity: quantity,
      },
    });
  }
  return cartItem;
};

export const updateCartItemQuantity = async (cartItemId, quantity, userId) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(cartItemId) },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    return null; 
  }

  return prisma.cartItem.update({
    where: { id: parseInt(cartItemId) },
    data: { quantity: quantity },
  });
};

export const removeCartItem = async (cartItemId, userId) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(cartItemId) },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    return null; // Not found or doesn't belong to user
  }

  await prisma.cartItem.delete({ where: { id: parseInt(cartItemId) } });
  return true;
};

export const clearUserCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    return null; // Cart not found
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return true;
};
