import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import '../App.css'; 

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // التحقق هل المستخدم مسجل دخوله أم لا

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // توجيه لصفحة تسجيل الدخول
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">معرض الصور الاحترافي</div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <Home size={18} /> الرئيسية
        </Link>

        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <User size={18} /> صفحة المستخدم
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} /> تسجيل الخروج
            </button>
          </>
        ) : (
          <>
            {/* زر تسجيل الدخول باللون البني */}
            <Link to="/login" className="btn-login">
              <LogIn size={18} /> تسجيل الدخول
            </Link>
            
            {/* زر إنشاء الحساب باللون الأخضر */}
            <Link to="/register" className="btn-register">
              <UserPlus size={18} /> إنشاء حساب
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}