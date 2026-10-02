const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً بالفعل' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // توليد التوكن
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب وتسجيل الدخول تلقائياً بنجاح',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم الداخلي' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // توليد التوكن للمستخدم المسجل
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'خطأ في الخادم الداخلي' });
  }
};