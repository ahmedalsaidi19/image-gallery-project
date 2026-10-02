const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

// [1] رفع صورة جديدة (للمستخدمين المسجلين فقط)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'يرجى إرفاق صورة صحيحة (PNG أو JPEG)' });
    }

    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'عنوان الصورة مطلوب' });
    }

    
    const imageUrl = `/uploads/${req.file.filename}`;

    const newImage = new Image({
      title,
      description: description || '',
      imageUrl,
      user: req.userId // يأتي من ميدلوير التحقق من التوكن
    });

    await newImage.save();

    res.status(201).json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      image: newImage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم الداخلي أثناء رفع الصورة' });
  }
};


exports.getAllImages = async (req, res) => {
  try {
    // جلب أحدث الصور وترتيبها تنازلياً مع إحضار اسم صاحب الصورة فقط
    const images = await Image.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في جلب الصور' });
  }
};


exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      images
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في جلب صور المستخدم' });
  }
};


exports.toggleLike = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.userId;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'الصورة غير موجودة' });
    }

    
    const isLiked = image.likes.includes(userId);

    if (isLiked) {
      
      image.likes = image.likes.filter(id => id.toString() !== userId);
    } else {
      
      image.likes.push(userId);
    }

    await image.save();

    res.json({
      success: true,
      message: isLiked ? 'تم إزالة الإعجاب' : 'تم تسجيل الإعجاب بنجاح',
      likesCount: image.likes.length,
      likes: image.likes
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في معالجة الإعجاب' });
  }
};


exports.updateImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'الصورة غير موجودة' });
    }

    
    if (image.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل هذه الصورة' });
    }

    image.title = title || image.title;
    image.description = description !== undefined ? description : image.description;

    await image.save();

    res.json({
      success: true,
      message: 'تم تحديث معلومات الصورة بنجاح',
      image
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في تحديث الصورة' });
  }
};


exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: 'الصورة غير موجودة' });
    }

    // التأكد أن المستخدم هو صاحب الصورة
    if (image.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذه الصورة' });
    }

    // حذف ملف الصورة الفعلي من مجلد uploads محلياً
    const filePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // حذف المستند من قاعدة البيانات
    await image.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الصورة بنجاح'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في حذف الصورة' });
  }
};