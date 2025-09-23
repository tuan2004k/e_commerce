import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
// import logger from './src/utils/logger.js'; // Import logger
import requestLogger from './src/middleware/requestLogger.js'; // Import requestLogger middleware
import errorHandler from './src/middleware/errorHandler.js'; // Import error handling middleware
import userRoutes from './src/routes/user.routes.js'; // Import user routes
import protect from './src/middleware/authMiddleware.js'; // Import protect middleware
import swaggerUi from 'swagger-ui-express'; // Uncommented Swagger UI
import { swaggerDocs } from './swaggerConfig.js';
import authRoutes from './src/routes/auth.routes.js'; // Import auth routes
import productRoutes from './src/routes/product.routes.js'; // Import product routes
import cartRoutes from './src/routes/cart.routes.js'; // Import cart routes
import orderRoutes from './src/routes/order.routes.js'; // Import order routes
import categoryRoutes from './src/routes/category.routes.js'; // Import category routes
import uploadRoutes from './src/routes/upload.routes.js'; // Import upload routes
import discountRoutes from './src/routes/discount.routes.js'; // Import discount routes
import reviewRoutes from './src/routes/review.routes.js'; // Import review routes
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Use CORS middleware
// app.use(bodyParser.json()); // Removed to prevent conflict with multer for multipart/form-data
app.use(requestLogger); // Use requestLogger middleware

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger UI

// Routes
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/users', protect, userRoutes);
app.use('/api/products', productRoutes); // Use product routes
app.use('/api/cart', cartRoutes); // Use cart routes
app.use('/api/orders', orderRoutes); // Use order routes
app.use('/api/categories', categoryRoutes); // Use category routes
app.use('/api/upload', uploadRoutes); // Use upload routes
app.use('/api/discounts', discountRoutes); // Use discount routes
app.use('/api/reviews', reviewRoutes); // Use review routes

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

// Error handling middleware (should be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
