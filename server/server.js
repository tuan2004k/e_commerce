import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors'; 
import helmet from 'helmet'; 
import requestLogger from './src/middleware/requestLogger.js'; 
import errorHandler from './src/middleware/errorHandler.js'; 
import userRoutes from './src/routes/user.routes.js'; 
import protect from './src/middleware/authMiddleware.js'; 
import swaggerUi from 'swagger-ui-express'; 
import { swaggerDocs } from './swaggerConfig.js';
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js'; 
import cartRoutes from './src/routes/cart.routes.js'; 
import orderRoutes from './src/routes/order.routes.js'; 
import categoryRoutes from './src/routes/category.routes.js'; 
import uploadRoutes from './src/routes/upload.routes.js'; 
import discountRoutes from './src/routes/discount.routes.js'; 
import reviewRoutes from './src/routes/review.routes.js'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path'; 
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(helmet({
})); // Use helmet with COOP and COEP policies
app.use(cors()); 
app.use(requestLogger); 
app.use(express.json());
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); 

app.use('/api/auth', authRoutes); 
app.use('/api/users', protect, userRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/categories', categoryRoutes); 
app.use('/api/upload', uploadRoutes); 
app.use('/api/discounts', discountRoutes); 
app.use('/api/reviews', reviewRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
