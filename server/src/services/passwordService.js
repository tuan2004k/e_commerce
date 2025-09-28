import prisma from '../utils/prismaClient.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import {
  ValidationError,
  isRequired,
  isValidEmail,
  isValidPassword,
  validateUserExists,
  validateResetToken,
} from '../utils/validationUtils.js';

export const initiateForgotPassword = async (email) => {
  isRequired(email, 'Email');
  if (!isValidEmail(email)) {
    throw new ValidationError('Email không hợp lệ.');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Gửi phản hồi thành công để tránh tiết lộ thông tin người dùng
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.resetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `Bạn nhận được email này vì bạn (hoặc ai đó khác) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\nVui lòng nhấp vào liên kết sau hoặc dán vào trình duyệt của bạn để hoàn tất quá trình:\n\n${resetUrl}\n\nNếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ vẫn không thay đổi.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Đặt lại mật khẩu',
      message,
    });
  } catch (error) {
    console.error('Lỗi gửi email đặt lại mật khẩu:', error);
    throw new ValidationError('Lỗi khi gửi email đặt lại mật khẩu.');
  }
};

export const resetUserPassword = async (token, newPassword) => {
  isRequired(newPassword, 'Mật khẩu mới');
  if (!isValidPassword(newPassword)) {
    throw new ValidationError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.');
  }

  const resetToken = await validateResetToken(token);
  const user = await validateUserExists(resetToken.userId);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: user.password },
  });

  await prisma.resetToken.delete({
    where: { id: resetToken.id },
  });

  const newToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token: newToken };
};
