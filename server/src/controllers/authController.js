import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await authService.registerUser({ name, email, password, role });

  res.status(201).json({
    message: 'Đăng ký thành công',
    ...result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.status(200).json({
    message: 'Đăng nhập thành công',
    ...result,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  res.status(200).json(user);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body; 
  const result = await authService.forgotPasswordUser(email);
  res.status(200).json(result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const result = await authService.resetPasswordUser(token, password);
  res.status(200).json(result);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const result = await authService.googleLoginUser(token);

  res.status(200).json({
    message: 'Đăng nhập bằng Google thành công',
    ...result,
  });
});