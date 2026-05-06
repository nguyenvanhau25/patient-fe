
import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Shield, LogOut, ChevronRight, Users, Loader2, AlertCircle } from 'lucide-react';
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
    try {
      const response = await patientApi.getProfile(user?.userId || 'patient_123');
      setProfile(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Lỗi kết nối. Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patientApi.updateProfile(user?.userId || 'patient_123', profile);
      alert('Cập nhật thành công!');
    } catch (err) {
      alert('Cập nhật thất bại. Lỗi kết nối.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading-state" style={{ height: '50vh' }}>
      <Loader2 className="animate-spin" size={40} />
      <p>Đang tải thông tin hồ sơ...</p>
    </div>
  );

  if (error) return (
    <div className="no-data-full" style={{ padding: '4rem' }}>
      <AlertCircle size={40} color="var(--danger)" />
      <p className="text-muted m-t-1">{error}</p>
      <button className="btn-secondary m-t-1" onClick={fetchProfile}>Thử lại</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-container">
      <div className="profile-header card glass">
        <div className="profile-hero">
          <div className="avatar-section">
            <div className="avatar-large">{profile?.fullName?.charAt(0) || user?.email?.charAt(0)}</div>
            <button className="btn-camera"><Camera size={18} /></button>
          </div>
          <div className="profile-titles">
            <h1>{profile?.fullName || 'Người dùng'}</h1>
            <p className="status">Bệnh nhân • ID: {user?.userId || 'N/A'}</p>
          </div>
          <button className="btn-logout" onClick={logout}><LogOut size={18} /> Đăng xuất</button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-left">
          <section className="profile-section card glass">
            <h3>Thông tin cá nhân</h3>
            <form className="profile-form" onSubmit={handleUpdate}>
              <div className="form-row grid-cols-2">
                <div className="form-group">
                  <label><User size={14} /> Họ và Tên</label>
                  <input type="text" value={profile?.fullName || ''} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label><Calendar size={14} /> Ngày sinh</label>
                  <input type="date" value={profile?.dateOfBirth || ''} onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label><MapPin size={14} /> Địa chỉ</label>
                <input type="text" value={profile?.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} />
              </div>
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : 'Cập nhật thông tin'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
