// services/UserService.js
import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

const UserService = {
  async createUser({ email, password, name, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CUSTOMER',
        cart: { create: {} }, // Tạo giỏ hàng
      },
    });
  },

  async validatePassword(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  },

  async getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
};

export default UserService;