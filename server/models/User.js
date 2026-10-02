const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  name: { 
    type: String, 
    required: [true, 'اسم المستخدم مطلوب'] 
  },
  
  
  email: { 
    type: String, 
    required: [true, 'البريد الإلكتروني مطلوب'], 
    unique: true, 
    lowercase: true 
  },
  
  
  password: { 
    type: String, 
    required: [true, 'كلمة المرور مطلوبة'] 
  }
}, { 
  // [6] تفعيل خاصية timestamps لتسجيل تاريخ إنشاء الحساب وتحديثه تلقائياً
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);