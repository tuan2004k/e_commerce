import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { successResponse, errorResponse } from '../utils/responseUtils.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload a single image file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:    # <------ name of your file input
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     filePath:
 *                       type: string
 *       400:
 *         description: Invalid file type or no file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }
    successResponse(res, 'Image uploaded successfully', { filePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

export default router;
