import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async ({ name, email, password, role = 'CUSTOMER' }) => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new Error('Người dùng đã tồn tại');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Thông tin đăng nhập không hợp lệ');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Thông tin đăng nhập không hợp lệ');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const forgotPasswordUser = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Không tìm thấy người dùng với email này.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExpires = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: resetToken, resetPasswordExpires },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const message = `
    <h1>Đặt lại mật khẩu</h1>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào liên kết bên dưới để đặt lại mật khẩu:</p>
    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Đặt lại mật khẩu</a>
    <p>Hoặc copy link này vào trình duyệt: ${resetUrl}</p>
    <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.</p>
  `;

  try {
    await sendEmail({ email: user.email, subject: 'Đặt lại mật khẩu', message });
    return { message: 'Email đặt lại mật khẩu đã được gửi.' };
  } catch (error) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: null, resetPasswordExpires: null },
    });
    throw new Error('Không thể gửi email đặt lại mật khẩu.');
  }
};

export const resetPasswordUser = async (token, password) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
  });

  return { message: 'Mật khẩu đã được đặt lại thành công.' };
};

export const googleLoginUser = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Không thể xác thực token Google.');
  }

  const { email, name } = payload;
  if (!email) {
    throw new Error('Không thể lấy email từ Google.');
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });
  }

  const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: appToken,
  };
};