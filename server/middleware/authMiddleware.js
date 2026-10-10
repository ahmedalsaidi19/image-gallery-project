const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {

  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'غير حاصل على صلاحية الوصول، يرجى تسجيل الدخول' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // إرفاق معرف المستخدم بالطلب (Request) لنستخدمه في المتحكمات لاحقاً
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'رمز التوثيق (Token) غير صالح أو انتهت صلاحيته' });
  }
};