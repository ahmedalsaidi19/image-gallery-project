import React, { useEffect, useState } from 'react';
import API from '../config/axios';
import { playLikeSound } from '../utils/sound'; // استيراد دالة الصوت
import { Heart, X } from 'lucide-react';
import '../App.css'; 

export default function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = (useState(null)); // لتكبير الصورة
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await API.get('/images');
      setImages(res.data.images);
      setLoading(false);
    } catch (err) {
      console.error('خطأ في جلب الصور', err);
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (!token) {
      alert('يجب تسجيل الدخول أولاً لتتمكن من الإعجاب بالصورة!');
      return;
    }

    try {
      playLikeSound();
      const res = await API.post(`/images/${id}/like`);
      setImages(images.map(img => img._id === id ? { ...img, likes: res.data.likes } : img));
    } catch (err) {
      console.error('خطأ في تسجيل الإعجاب', err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>جاري تحميل الصور...</div>;

  return (
    <div className="page-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>معرض الصور الحديثة</h1>

      {images.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>لا توجد صور مشاركة حتى الآن.</p>
      ) : (
        <div className="images-grid">
          {images.map((img) => {
            const isLiked = token ? img.likes.includes(currentUser.id) : false;
            return (
              <div key={img._id} className="image-card">
                {/* عرض الصورة كمصغرة وعند الضغط عليها تكبر */}
                <img 
                  src={`http://localhost:5000${img.imageUrl}`} 
                  alt={img.title} 
                  className="image-thumbnail"
                  onClick={() => setSelectedImage(img)}
                />
                <div className="card-body">
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#333' }}>{img.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 0.5rem 0' }}>{img.description}</p>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>رفع بواسطة: {img.user?.name || 'مستخدم'}</p>

                  {/* زر الإعجاب يظهر فقط للمستخدم المسجل دخوله */}
                  {token ? (
                    <div className="card-actions" style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                      <button 
                        onClick={() => handleLike(img._id)} 
                        className="btn-login"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isLiked ? '#e91e63' : '#666',
                          padding: '0.4rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        <Heart fill={isLiked ? '#e91e63' : 'none'} size={20} />
                        <span>{img.likes.length}</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', fontSize: '0.9rem' }}>
                      <Heart size={18} />
                      <span>{img.likes.length} إعجاب</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      }
      {selectedImage && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} 
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="form-box" 
            style={{ maxWidth: '800px', width: '90%', position: 'relative', textAlign: 'center' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="btn-logout"
              style={{ position: 'absolute', top: '10px', left: '10px', padding: '0.3rem 0.6rem' }}
            >
              <X size={20} />
            </button>
            <img 
              src={`http://localhost:5000${selectedImage.imageUrl}`} 
              alt={selectedImage.title} 
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', marginBottom: '1rem', borderRadius: '4px' }} 
            />
            <h2>{selectedImage.title}</h2>
            <p>{selectedImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}