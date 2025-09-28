import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút.',
});

router.post('/login', loginLimiter, validateLogin, login);