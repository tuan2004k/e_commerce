import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library'; // Import OAuth2Client
import { asyncHandler } from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Initialize Google OAuth2Client

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

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetPasswordExpires,
    },
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  const message = `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết này để đặt lại mật khẩu của bạn: <a href="${resetUrl}">${resetUrl}</a>. Liên kết này sẽ hết hạn sau 1 giờ.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Đặt lại mật khẩu',
      message,
    });

    res.status(200).json({ message: 'Email đặt lại mật khẩu đã được gửi.' });
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    console.error(error);
    return res.status(500).json({ message: 'Không thể gửi email đặt lại mật khẩu.' });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a new user if not found
      // For simplicity, generate a random password, as Google users won't use it for direct login
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), salt);

      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          password: hashedPassword, // Store a dummy/random password
          // You might want to store the Google profile picture as well
        },
      });
    }

    // Generate JWT token for your application
    const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Đăng nhập bằng Google thành công',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: appToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: 'Mã thông báo Google không hợp lệ hoặc đã hết hạn.' });
  }
});
