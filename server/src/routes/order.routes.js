import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/OrderController.js';
import protect from '../middleware/authMiddleware.js';


const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *             properties:
 *               discountId:
 *                 type: integer
 *                 format: int32
 *                 description: Optional ID of a discount to apply
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       format: int32
 *                       description: ID of the product
 *                     quantity:
 *                       type: integer
 *                       format: int32
 *                       minimum: 1
 *                       description: Quantity of the product
 *             example:
 *               discountId: 1
 *               orderItems:
 *                 - productId: 1
 *                   quantity: 2
 *                 - productId: 2
 *                   quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createOrder);
router.get('/', getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found or does not belong to user
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update order status by ID (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - PROCESSING
 *                   - SHIPPED
 *                   - DELIVERED
 *                   - CANCELLED
 *                 description: New status of the order
 *             example:
 *               status: SHIPPED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status or input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getOrderById);
// router.put('/:id/status', authorize(['ADMIN']), updateOrderStatus);

export default router;
