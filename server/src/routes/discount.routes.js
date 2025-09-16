import express from 'express';
import { createDiscount, getDiscounts, getDiscountById, updateDiscount, deleteDiscount } from '../controllers/DiscountController.js';
import protect from '../middleware/authMiddleware.js';
// import authorize middleware if needed for admin routes

const router = express.Router();

// Admin routes (example, assuming protect and authorize middlewares exist)
// router.use(protect, authorize(['ADMIN'])); // Apply to all admin discount routes

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discount code management
 */

/**
 * @swagger
 * /api/discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: A list of discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discount'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new discount (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - startDate
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique discount code
 *               description:
 *                 type: string
 *                 description: Description of the discount
 *               percentage:
 *                 type: number
 *                 format: float
 *                 description: Discount percentage (e.g., 10 for 10%)
 *               fixedAmount:
 *                 type: number
 *                 format: float
 *                 description: Fixed discount amount
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: When the discount becomes active
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: When the discount expires
 *             example:
 *               code: SUMMER20
 *               description: 20% off summer collection
 *               percentage: 20
 *               startDate: '2025-06-01T00:00:00Z'
 *               endDate: '2025-08-31T23:59:59Z'
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/', createDiscount);
router.get('/', getDiscounts);

/**
 * @swagger
 * /api/discounts/{id}:
 *   get:
 *     summary: Get discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the discount to retrieve
 *     responses:
 *       200:
 *         description: Discount data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a discount by ID (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the discount to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountInput'
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a discount by ID (Admin only)
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the discount to delete
 *     responses:
 *       204:
 *         description: Discount deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getDiscountById);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);

export default router;
