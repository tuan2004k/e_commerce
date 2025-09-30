import { isValidEmail, isValidPassword, isRequired } from '../utils/validationUtils.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    isRequired(name, 'Name');
    isRequired(email, 'Email');
    isRequired(password, 'Password');

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ hoa, một chữ thường và một số',
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  try {
    isRequired(email, 'Email');
    isRequired(password, 'Mật khẩu');

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  try {
    isRequired(email, 'Email');
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;

  try {
    isRequired(password, 'Mật khẩu');
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ hoa, một chữ thường và một số',
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validateGoogleLogin = (req, res, next) => {
  const { token } = req.body;

  try {
    isRequired(token, 'Google token');
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};