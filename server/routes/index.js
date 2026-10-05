const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../models/uploadConfig');

// دالة فحص نتائج الـ Validator وإرجاع الأخطاء
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.post('/auth/register', [
  body('name', 'الاسم مطلوب').not().isEmpty(),
  body('email', 'البريد غير صالح').isEmail(),
  body('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').isLength({ min: 6 })
], validateResults, authController.register);

router.post('/auth/login', [
  body('email', 'البريد غير صالح').isEmail(),
  body('password', 'كلمة المرور مطلوبة').exists()
], validateResults, authController.login);

router.get('/images', imageController.getAllImages);
router.post('/images/upload', authMiddleware, upload.single('image'), imageController.uploadImage);
router.get('/images/my-images', authMiddleware, imageController.getUserImages);
router.post('/images/:id/like', authMiddleware, imageController.toggleLike);
router.put('/images/:id', authMiddleware, imageController.updateImage);
router.delete('/images/:id', authMiddleware, imageController.deleteImage);

module.exports = router;