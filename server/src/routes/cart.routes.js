import express from 'express';
import { getUserCart, addProductToCart, updateCartItemQuantity, removeProductFromCart, clearCart } from '../controllers/CartController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found for this user
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Clear user's entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found for this user
 *       500:
 *         description: Server error
 */
router.get('/', getUserCart);
router.delete('/clear', clearCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart or update quantity if already exists
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 format: int32
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 description: Quantity of the product
 *             example:
 *               productId: 1
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/add', addProductToCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 description: New quantity of the product in cart
 *             example:
 *               quantity: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedCartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found or does not belong to user
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Product removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found or does not belong to user
 *       500:
 *         description: Server error
 */
router.put('/:id', updateCartItemQuantity); // :id here refers to cartItemId
router.delete('/:id', removeProductFromCart); // :id here refers to cartItemId

export default router;
