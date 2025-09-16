import express from 'express';
import { createReview, getReviewsByProduct, getUserReviews, getReviewById, updateReview, deleteReview } from '../controllers/ReviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for getting reviews
router.get('/product/:productId', getReviewsByProduct);
router.get('/:id', getReviewById);

// Protected routes for authenticated users
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management
 */

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to retrieve reviews for
 *     responses:
 *       200:
 *         description: A list of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get('/product/:productId', getReviewsByProduct);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by its ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the review to retrieve
 *     responses:
 *       200:
 *         description: Review data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an existing review (user must be the owner)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 maximum: 5
 *                 description: New rating for the product
 *               comment:
 *                 type: string
 *                 description: New comment for the product
 *             example:
 *               rating: 4
 *               comment: "Good product, but shipping was slow."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found or not owned by user
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an existing review (user must be the owner)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *         description: Review not found or not owned by user
 *       500:
 *         description: Server error
 */
router.get('/:id', getReviewById);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review for a product
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               productId:
 *                 type: integer
 *                 format: int32
 *                 description: ID of the product being reviewed
 *               rating:
 *                 type: integer
 *                 format: int32
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating given to the product (1-5)
 *               comment:
 *                 type: string
 *                 description: Optional comment for the review
 *             example:
 *               productId: 1
 *               rating: 5
 *               comment: "Absolutely love this product! Highly recommended."
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input or already reviewed this product
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', createReview);

/**
 * @swagger
 * /api/reviews/user:
 *   get:
 *     summary: Get all reviews by the authenticated user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user', getUserReviews);

export default router;
