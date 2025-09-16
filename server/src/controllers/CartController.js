import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({
    where: { userId }, include: { cartItems: { include: { product: true } } }
  });
  if (!cart) return res.status(404).json({
    message: 'Không tìm thấy giỏ hàng cho người dùng này'
  });
  res.status(200).json(cart);
});

export const addProductToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  let cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) cart = await prisma.cart.create({
    data: { userId }
  });
  let cartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    }
  });
  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + quantity }
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId), quantity
      }
    });
  }
  res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng', cartItem });
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) return res.status(404).json({
    message: 'Không tìm thấy giỏ hàng cho người dùng này'
  });
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(id) },
    include: { cart: true }
  });
  if (!cartItem || cartItem.cart.userId !== userId) return res
    .status(404)
    .json({
      message: 'Không tìm thấy sản phẩm trong giỏ hoặc không thuộc người dùng'
    });
  const updatedCartItem = await prisma.cartItem.update({ where: { id: parseInt(id) }, data: { quantity } });
  res
    .status(200)
    .json(
      {
        message: 'Cập nhật số lượng sản phẩm thành công',
        updatedCartItem
      });
});

export const removeProductFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });
  if (!cart) return res.status(404).json({
    message: 'Không tìm thấy giỏ hàng cho người dùng này'
  });
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(id) },
    include: { cart: true }
  });
  if (!cartItem || cartItem.cart.userId !== userId) return res.status(404).json({
    message: 'Không tìm thấy sản phẩm trong giỏ hoặc không thuộc người dùng'
  });
  await prisma.cartItem.delete({
    where: { id: parseInt(id) }
  });
  res.status(200).json({
    message: 'Đã xóa sản phẩm khỏi giỏ hàng'
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return res.status(404).json({
    message: 'Không tìm thấy giỏ hàng cho người dùng này'
  });
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
  res.status(200).json({
    message: 'Đã xóa toàn bộ giỏ hàng'
  });
});
