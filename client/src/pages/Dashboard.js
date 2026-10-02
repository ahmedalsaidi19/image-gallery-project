import React, { useEffect, useState } from 'react';
import API from '../config/axios';
import { Trash2, Edit, Upload } from 'lucide-react';
import '../App.css'; 

export default function Dashboard() {
  const [myImages, setMyImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [editingImage, setEditingImage] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchMyImages();
  }, []);

  const fetchMyImages = async () => {
    try {
      const res = await API.get('/images/my-images');
      setMyImages(res.data.images);
    } catch (err) {
      console.error('خطأ في جلب صور المستخدم', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('يرجى اختيار صورة وإدخال العنوان على الأقل');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);

    setLoading(true);
    setMessage('');

    try {
      await API.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitle('');
      setDescription('');
      setFile(null);
      setMessage('تم رفع الصورة بنجاح!');
      fetchMyImages(); // إعادة جلب الصور لتحديث القائمة
    } catch (err) {
      setMessage(err.response?.data?.message || 'فشل رفع الصورة');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      await API.delete(`/images/${id}`);
      setMyImages(myImages.filter(img => img._id !== id));
    } catch (err) {
      alert('فشل حذف الصورة');
    }
  };


  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`/images/${id}`, {
        title: newTitle,
        description: newDescription
      });
      
      setMyImages(myImages.map(img => img._id === id ? res.data.image : img));
      setEditingImage(null);
    } catch (err) {
      alert('فشل تعديل الصورة');
    }
  };

  return (
    <div className="page-container">
      <h1 className="dashboard-title">لوحة تحكم المستخدم</h1>

      {/* قسم رفع صورة جديدة */}
      <div className="form-box dashboard-upload-box">
        <h2><Upload size={20} /> رفع صورة جديدة</h2>
        {message && <p className="success-msg">{message}</p>}
        
        <form onSubmit={handleUpload} className="form">
          <input 
            type="text" 
            placeholder="عنوان الصورة" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="form-input"
          />
          <textarea 
            placeholder="وصف الصورة (اختياري)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="form-input"
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => setFile(e.target.files[0])} 
            required 
            className="form-input"
          />
          <button type="submit" disabled={loading} className="btn-login" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'جاري الرفع...' : 'رفع الصورة'}
          </button>
        </form>
      </div>

      {/* قسم صور المستخدم */}
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>صورك المرفوعة</h2>
      {myImages.length === 0 ? (
        <p className="dashboard-empty">لم تقم برفع أي صور حتى الآن.</p>
      ) : (
        <div className="images-grid">
          {myImages.map((img) => (
            <div key={img._id} className="image-card">
              <img src={`http://localhost:5000${img.imageUrl}`} alt={img.title} className="image-thumbnail" />
              <div className="card-body">
                {editingImage === img._id ? (
                  <div>
                    <input 
                      type="text" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)} 
                      className="form-input"
                    />
                    <textarea 
                      value={newDescription} 
                      onChange={(e) => setNewDescription(e.target.value)} 
                      className="form-input"
                      style={{ minHeight: '60px' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdate(img._id)} className="btn-register" style={{ padding: '0.4rem 0.8rem' }}>حفظ</button>
                      <button onClick={() => setEditingImage(null)} className="btn-logout" style={{ padding: '0.4rem 0.8rem', backgroundColor: '#9e9e9e' }}>إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3>{img.title}</h3>
                    <p>{img.description || 'بلا وصف'}</p>
                    <div className="card-actions">
                      <button onClick={() => { setEditingImage(img._id); setNewTitle(img.title); setNewDescription(img.description); }} className="btn-login" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        <Edit size={16} /> تعديل
                      </button>
                      <button onClick={() => handleDelete(img._id)} className="btn-logout" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        <Trash2 size={16} /> حذف
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}