
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, ShieldAlert, ShieldCheck, UserPlus, Mail, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './AdminUsers.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const AdminUsers = () => {
  const { data: usersRaw, loading, error, execute: fetchUsers } = useApi(() => authApi.getAllUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'PATIENT' });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const users = usersRaw || [];

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi.register(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        fetchUsers();
        setFormData({ fullName: '', email: '', password: '', role: 'PATIENT' });
      }, 1500);
    } catch (err) {
      alert('Lỗi đăng ký người dùng: ' + (err.response?.data?.message || 'Email đã tồn tại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role) => {
    if (role?.includes('ADMIN')) return <ShieldAlert size={16} />;
    if (role?.includes('DOCTOR')) return <ShieldCheck size={16} />;
    return <Shield size={16} />;
  };

  const getRoleClass = (role) => {
    if (role?.includes('ADMIN')) return 'role-admin';
    if (role?.includes('DOCTOR')) return 'role-doctor';
    return 'role-user';
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Quản lý Tài khoản</h1>
          <p className="text-muted">Quản lý bộ máy vận hành và bệnh nhân.</p>
        </motion.div>
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} /> <span>Thêm Thành viên</span>
        </motion.button>
      </header>

      {/* Modern Add User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-premium glass"
            >
              <div className="modal-header-p">
                <h3>Thêm người dùng mới</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              
              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal">
                    <div className="success-icon-box"><Check size={40} /></div>
                    <h4>Đăng ký thành công!</h4>
                    <p>Thành viên mới đã được thêm vào hệ thống.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddUser} className="premium-form">
                    <div className="form-group-p">
                      <label>Họ và tên</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Nguyễn Văn A" 
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="form-group-p">
                      <label>Email đăng nhập</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="user@hauanh.com" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1">
                        <label>Mật khẩu</label>
                        <input 
                          required 
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                      <div className="form-group-p flex-1">
                        <label>Chức vụ</label>
                        <select 
                          value={formData.role} 
                          onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="PATIENT">Bệnh nhân</option>
                          <option value="DOCTOR">Bác sĩ</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>
                      </div>
                    </div>
                    <div className="modal-actions-p mt-6">
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Tạo tài khoản'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card glass users-management-card">
        <div className="table-filters flex-between p-6">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm tên, email..." className="search-input" />
          </div>
          <button className="btn btn-secondary"><Filter size={18} /> <span>Lọc</span></button>
        </div>

        <div className="table-content">
          {loading ? (
            <div className="p-12"><LoadingState message="Đang tải danh sách..." /></div>
          ) : error ? (
            <div className="p-12"><EmptyState isError title="Lỗi tải dữ liệu" message={error} onAction={fetchUsers} actionLabel="Thử lại" /></div>
          ) : users.length === 0 ? (
            <div className="p-12"><EmptyState title="Trống" message="Chưa có người dùng nào." /></div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Thành viên</th>
                    <th>Vai trò</th>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Tùy chọn</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {users.map((user, index) => (
                      <motion.tr 
                        key={user.id || index}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="table-row"
                      >
                        <td>
                          <div className="user-profile-cell">
                            <div className="avatar-box">{user.fullName?.charAt(0) || 'U'}</div>
                            <div className="user-details">
                              <span className="user-name">{user.fullName || 'Ẩn danh'}</span>
                              <span className="user-id">ID: {user.id?.substring(0, 6)}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`badge-role ${getRoleClass(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </div>
                        </td>
                        <td><span className="text-sm font-medium">{user.email}</span></td>
                        <td>
                          <div className="status-indicator">
                            <span className="dot active"></span>
                            <span className="status-text">Online</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <button className="btn-icon"><MoreVertical size={18} /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminUsers;
