import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

const prisma = new PrismaClient();

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password } = req.body;
  const userExists = await prisma.user.findUnique({
    where: { email }
  });
  if (userExists) return res.status(400).json({
    message: 'Người dùng đã tồn tại'
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: req.body.role || 'CUSTOMER'
    }
  });
  const token = jwt.sign({
    id: user.id
  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' });
  res.status(201).json({
    message: 'Đăng ký thành công',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const {
    email,
    password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) return res
    .status(400)
    .json({
      message: 'Thông tin đăng nhập không hợp lệ'
    });
  const isMatch = await bcrypt.compare(
    password,
    user.password);
  if (!isMatch) return res.status(400).json({
    message: 'Thông tin đăng nhập không hợp lệ'
  });
  const token = jwt.sign({
    id: user.id
  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' });
  res.status(200).json({
    message: 'Đăng nhập thành công',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});
