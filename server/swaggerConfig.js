import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'A simple E-commerce API application documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            role: {
              type: 'string',
              enum: ['CUSTOMER', 'ADMIN'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Product ID',
            },
            name: {
              type: 'string',
              description: 'Product name',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Product price',
            },
            stock: {
              type: 'integer',
              format: 'int32',
              description: 'Product stock quantity',
            },
            image: {
              type: 'string',
              description: 'Product image URL',
            },
            size: {
              type: 'string',
              description: 'Product size e.g., S, M, L',
            },
            color: {
              type: 'string',
              description: 'Product color',
            },
            categoryId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the category the product belongs to',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product last update timestamp',
            },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price', 'stock', 'categoryId'],
          properties: {
            name: {
              type: 'string',
              description: 'Product name',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Product price',
            },
            stock: {
              type: 'integer',
              format: 'int32',
              description: 'Product stock quantity',
            },
            image: {
              type: 'string',
              description: 'Product image URL',
            },
            size: {
              type: 'string',
              description: 'Product size e.g., S, M, L',
            },
            color: {
              type: 'string',
              description: 'Product color',
            },
            categoryId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the category the product belongs to',
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Cart ID',
            },
            userId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the user who owns the cart',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Cart creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Cart last update timestamp',
            },
            cartItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem',
              },
              description: 'List of items in the cart',
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Cart item ID',
            },
            cartId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the cart this item belongs to',
            },
            productId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the product in this cart item',
            },
            quantity: {
              type: 'integer',
              format: 'int32',
              description: 'Quantity of the product in cart',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Cart item creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Cart item last update timestamp',
            },
            product: {
              $ref: '#/components/schemas/Product',
              description: 'Product details (included when fetching cart)',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Order ID',
            },
            userId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the user who placed the order',
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Total amount of the order',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
              description: 'Current status of the order',
            },
            discountId: {
              type: 'integer',
              format: 'int32',
              nullable: true,
              description: 'Optional ID of the applied discount',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order last update timestamp',
            },
            orderItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
              description: 'List of items in the order',
            },
            discount: {
              type: 'object',
              description: 'Discount details (included when fetching order)',
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Order item ID',
            },
            orderId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the order this item belongs to',
            },
            productId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the product in this order item',
            },
            quantity: {
              type: 'integer',
              format: 'int32',
              description: 'Quantity of the product',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the product at the time of order',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order item creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order item last update timestamp',
            },
            product: {
              $ref: '#/components/schemas/Product',
              description: 'Product details (included when fetching order)',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Category ID',
            },
            name: {
              type: 'string',
              description: 'Category name',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category last update timestamp',
            },
          },
        },
        UploadResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Image uploaded successfully',
            },
            data: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  example: '/uploads/image-1678886400000.png',
                },
              },
            },
          },
        },
        Discount: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Discount ID',
            },
            code: {
              type: 'string',
              description: 'Unique discount code',
            },
            description: {
              type: 'string',
              description: 'Description of the discount',
            },
            percentage: {
              type: 'number',
              format: 'float',
              nullable: true,
              description: 'Discount percentage e.g., 10 for 10%',
            },
            fixedAmount: {
              type: 'number',
              format: 'float',
              nullable: true,
              description: 'Fixed discount amount',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'When the discount becomes active',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'When the discount expires',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Discount creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Discount last update timestamp',
            },
          },
        },
        DiscountInput: {
          type: 'object',
          required: ['code', 'startDate'],
          properties: {
            code: {
              type: 'string',
              description: 'Unique discount code',
            },
            description: {
              type: 'string',
              description: 'Description of the discount',
            },
            percentage: {
              type: 'number',
              format: 'float',
              description: 'Discount percentage e.g., 10 for 10%',
            },
            fixedAmount: {
              type: 'number',
              format: 'float',
              description: 'Fixed discount amount',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'When the discount becomes active',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'When the discount expires',
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int32',
              description: 'Review ID',
            },
            userId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the user who made the review',
            },
            productId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the product being reviewed',
            },
            rating: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 5,
              description: 'Rating given to the product (1-5)',
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the review',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Review creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Review last update timestamp',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
              description: 'User who made the review',
            },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                image: { type: 'string' },
              },
              description: 'Product being reviewed',
            },
          },
        },
        ReviewInput: {
          type: 'object',
          required: ['productId', 'rating'],
          properties: {
            productId: {
              type: 'integer',
              format: 'int32',
              description: 'ID of the product being reviewed',
            },
            rating: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 5,
              description: 'Rating given to the product (1-5)',
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the review',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/auth.routes.js',
    './src/routes/user.routes.js',
    './src/routes/product.routes.js',
    './src/routes/cart.routes.js',
    './src/routes/order.routes.js',
    './src/routes/category.routes.js',
    './src/routes/upload.routes.js',
    './src/routes/discount.routes.js',
    './src/routes/review.routes.js',
  ],
};

const swaggerDocs = swaggerJsdoc(options);

export { swaggerDocs };
