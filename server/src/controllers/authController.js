import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { asyncHandler } from '../utils/asyncHandler.js';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    return res.status(400).json({
      message: 'Người dùng đã tồn tại'
    });
  }

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

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

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
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(400).json({
      message: 'Thông tin đăng nhập không hợp lệ'
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: 'Thông tin đăng nhập không hợp lệ'
    });
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

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
    return res.status(404).json({
      message: 'Không tìm thấy người dùng với email này.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

  // FIXED: Properly update user with new fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetPasswordExpires,
    },
  });

  // FIXED: Use environment variable for frontend URL
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const message = `
    <h1>Đặt lại mật khẩu</h1>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào liên kết bên dưới để đặt lại mật khẩu:</p>
    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Đặt lại mật khẩu</a>
    <p>Hoặc copy link này vào trình duyệt: ${resetUrl}</p>
    <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Đặt lại mật khẩu',
      message,
    });

    res.status(200).json({
      message: 'Email đặt lại mật khẩu đã được gửi.'
    });
  } catch (error) {
    // FIXED: Clean up tokens if email fails
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    console.error('Send email error:', error);
    return res.status(500).json({
      message: 'Không thể gửi email đặt lại mật khẩu.'
    });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // FIXED: Add password validation
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: 'Mật khẩu phải có ít nhất 6 ký tự.'
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({
      message: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
    });
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

  res.status(200).json({
    message: 'Mật khẩu đã được đặt lại thành công.'
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: 'Google token là bắt buộc.'
    });
  }

  try {
    console.log('Nhận Google ID token:', token); // Log token nhận được

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Payload xác thực từ Google:', payload); // Log payload

    if (!payload) {
      return res.status(400).json({
        message: 'Không thể xác thực token Google.'
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({
        message: 'Không thể lấy email từ Google.'
      });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

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
          // googleId: googleId,
          // avatar: picture,
        },
      });
      console.log('Tạo user mới từ Google:', user); // Log user mới
    }

    const appToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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

    if (error.message && error.message.includes('Token used too late')) {
      return res.status(400).json({
        message: 'Google token đã hết hạn.'
      });
    }

    if (error.message && error.message.includes('Invalid token signature')) {
      return res.status(400).json({
        message: 'Google token không hợp lệ.'
      });
    }

    res.status(400).json({
      message: 'Xác thực Google thất bại. Vui lòng thử lại.'
    });
  }
});