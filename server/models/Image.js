
const mongoose = require('mongoose');

// [2] إنشاء مخطط (Schema) جدول الصور في المعرض
const imageSchema = new mongoose.Schema({
  // [3] عنوان الصورة: نص وإجباري
  title: { 
    type: String, 
    required: [true, 'عنوان الصورة مطلوب'] 
  },
  
  // [4] وصف الصورة: نص اختياري يوضح تفاصيلها
  description: { 
    type: String, 
    default: '' 
  },
  
  // [5] مسار أو رابط الصورة المرفوعة على الخادم
  imageUrl: { 
    type: String, 
    required: [true, 'رابط الصورة مطلوب'] 
  },
  
  // [6] صاحب الصورة: ربط (Reference) مع جدول المستخدمين (User) لتعرف من رفعها
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // [7] قائمة الإعجابات: مصفوفة تحتوي على معرفات المستخدمين الذين أعجبوا بالصورة
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { 
  // [8] لتسجيل وقت رفع الصورة والتعديل عليها تلقائياً
  timestamps: true 
});

module.exports = mongoose.model('Image', imageSchema);