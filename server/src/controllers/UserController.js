import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || undefined,
      email: email || undefined
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
  });
  res.status(200).json({ message: 'Cập nhật hồ sơ thành công', user: updatedUser });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
  });
  res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
  });
  if (!user) return res.status(404).json({
    message: 'Không tìm thấy người dùng'
  });
  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    role } = req.body;
  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name: name || undefined,
      email: email || undefined,
      role: role || undefined
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
  });
  res.status(200).json({
    message: 'Cập nhật người dùng thành công',
    user: updatedUser
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where:
      { id: parseInt(id) }
  });
  res.status(204).send();
});
