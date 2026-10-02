import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../config/axios';
import { LogIn } from 'lucide-react';
import '../App.css'; // استيراد ملف التنسيقات الرئيسي

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // التوجيه التلقائي لصفحة المستخدم
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'البريد أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form-box">
        <h2 style={{ color: '#795548', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogIn /> تسجيل الدخول
        </h2>

        {error && <div className="error-msg">{error}</div>}

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
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />

        {/* زر تسجيل الدخول باللون البني */}
        <button type="submit" className="btn-login" style={{ width: '100%', justifyContent: 'center' }}>دخول</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ليس لديك حساب؟ <Link to="/register" style={{ color: '#795548' }}>أنشئ حساباً جديداً</Link>
        </p>
      </form>
    </div>
  );
}