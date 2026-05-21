import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, Calendar, Camera, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    // Dùng patientId thật (từ patient-service), không phải userId từ auth
    const patientId = user?.patientId;

    if (!patientId) {
      setLoading(false);
      setError('Không tìm thấy hồ sơ bệnh nhân. Tài khoản này chưa được liên kết với hồ sơ bệnh nhân. Vui lòng liên hệ quản trị viên.');
      return;
    }

    try {
      const response = await patientApi.getProfile(patientId);
      setProfile(response.data?.data || response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      if (err.response?.status === 400) {
        setError('ID bệnh nhân không hợp lệ. Vui lòng đăng xuất và đăng nhập lại.');
      } else {
        setError('Lỗi kết nối. Không thể tải thông tin hồ sơ.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const patientId = user?.patientId;
    if (!patientId) return;

    setSaving(true);
    try {
      await patientApi.updateProfile(patientId, {
        name: profile.name,
        email: profile.email,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
      });
      alert('Cập nhật thành công!');
    } catch (err) {
      alert('Cập nhật thất bại: ' + (err.response?.data?.message || 'Lỗi kết nối.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading-state" style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <Loader2 className="animate-spin" size={40} />
      <p>Đang tải thông tin hồ sơ...</p>
    </div>
  );

  if (error) return (
    <div className="no-data-full" style={{ padding: '4rem', textAlign: 'center' }}>
      <AlertCircle size={40} color="var(--danger)" />
      <p className="text-muted" style={{ marginTop: '1rem' }}>{error}</p>
      <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchProfile}>Thử lại</button>
      <button className="btn-logout" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem auto 0' }} onClick={logout}>
        <LogOut size={18} /> Đăng xuất
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-container">
      <div className="profile-header card glass">
        <div className="profile-hero">
          <div className="avatar-section">
            <div className="avatar-large">
              {profile?.profileImageUrl
                ? <img src={profile.profileImageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : (profile?.name || user?.email || 'U').charAt(0).toUpperCase()
              }
            </div>
            <button className="btn-camera"><Camera size={18} /></button>
          </div>
          <div className="profile-titles">
            <h1>{profile?.name || 'Người dùng'}</h1>
            <p className="status">Bệnh nhân • {profile?.email}</p>
          </div>
          <button className="btn-logout" onClick={logout}><LogOut size={18} /> Đăng xuất</button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-left">
          <section className="profile-section card glass">
            <h3>Thông tin cá nhân</h3>
            <form className="profile-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label><User size={14} /> Họ và Tên</label>
                <input
                  type="text"
                  value={profile?.name || ''}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><Mail size={14} /> Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><Calendar size={14} /> Ngày sinh</label>
                <input
                  type="text"
                  value={profile?.dateOfBirth || ''}
                  onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  placeholder="yyyy-MM-dd"
                />
              </div>
              <div className="form-group">
                <label><MapPin size={14} /> Địa chỉ</label>
                <input
                  type="text"
                  value={profile?.address || ''}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : 'Cập nhật thông tin'}
              </button>
            </form>
          </section>
        </div>

        <div className="profile-right">
          <section className="profile-section-mini card glass">
            <h3>Thông tin tài khoản</h3>
            <div className="setting-item">
              <User size={16} />
              <span>Vai trò: <strong>{user?.role}</strong></span>
            </div>
            <div className="setting-item">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;