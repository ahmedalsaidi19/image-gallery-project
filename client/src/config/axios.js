import axios from 'axios';

// [1] إنشاء نسخة مخصصة من Axios مع الرابط الأساسي للخادم (Backend)
const API = axios.create({
  baseURL: 'http://localhost:5000/api' // رابط خادم Node.js المحلي
});

// [2] إضافة معترض الطلبات (Interceptor) لإرسال التوكن تلقائياً مع كل طلب يحتاج صلاحية
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // إرفاق التوكن في ترويسة الطلب
  }
  return req;
});

export default API;