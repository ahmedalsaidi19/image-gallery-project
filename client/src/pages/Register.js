import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config/axios';
import { UserPlus } from 'lucide-react';
import '../App.css'; // استيراد ملف التنسيقات الرئيسي

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/register', { name, email, password });
      // حفظ التوكن وبيانات المستخدم في localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // التوجيه التلقائي لصفحة المستخدم كما طلب في المشروع
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleRegister} className="form-box">
        <h2 style={{ color: '#4CAF50', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus /> إنشاء حساب جديد
        </h2>

        {error && <div className="error-msg">{error}</div>}

        <input
          type="text"
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="password"
          placeholder="كلمة المرور (6 أحرف على الأقل)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />

        {/* زر إنشاء الحساب باللون الأخضر */}
        <button type="submit" className="btn-register" style={{ width: '100%', justifyContent: 'center' }}>إنشاء الحساب وتسجيل الدخول</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          لديك حساب بالفعل؟ <Link to="/login" style={{ color: '#4CAF50' }}>سجل دخولك هنا</Link>
        </p>
      </form>
    </div>
  );
}