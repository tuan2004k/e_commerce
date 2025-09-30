import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { successResponse, errorResponse } from '../utils/responseUtils.js';
import cloudinary from '../config/Cloudinary.js'; // Import default export
import fs from 'fs';

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
 *     summary: Upload a single image file to Cloudinary
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
 *               image:
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
 *                     url:
 *                       type: string
 *                       description: URL of the uploaded image on Cloudinary
 *       400:
 *         description: Invalid file type or no file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/image', upload.single('image'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return errorResponse(res, 'Không có file được upload', 400);
    }
    console.log('Upload success, URL:', req.file.path);
    successResponse(res, 'Upload thành công', { url: req.file.path });
  } catch (error) {
    console.error('Upload error:', error);
    errorResponse(res, 'Lỗi upload: ' + error.message, 500);
  }
});

export default router;