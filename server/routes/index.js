const express = require('express');
const router = express.Router();
const { body } = require('express-validator');


const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');


const authMiddleware = require('../middleware/authMiddleware');


const upload = require('../models/uploadConfig');


router.post('/auth/register', [
  body('name', 'الاسم مطلوب').not().isEmpty(),
  body('email', 'البريد غير صالح').isEmail(),
  body('password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').isLength({ min: 6 })
], authController.register);

router.post('/auth/login', [
  body('email', 'البريد غير صالح').isEmail(),
  body('password', 'كلمة المرور مطلوبة').exists()
], authController.login);



router.get('/images', imageController.getAllImages);


router.post('/images/upload', authMiddleware, upload.single('image'), imageController.uploadImage);


router.get('/images/my-images', authMiddleware, imageController.getUserImages);


router.post('/images/:id/like', authMiddleware, imageController.toggleLike);


router.put('/images/:id', authMiddleware, imageController.updateImage);


router.delete('/images/:id', authMiddleware, imageController.deleteImage);

module.exports = router;