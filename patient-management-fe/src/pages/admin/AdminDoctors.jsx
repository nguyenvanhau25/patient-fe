import React, { useState } from 'react';
import { Search, Plus, Star, Calendar, Edit, Trash2, Mail, Phone, UserCheck, X, Loader2, Check, Activity, Award, Briefcase, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctorApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './AdminUsers.css'; // Reuse table and modal styles
const API_GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004';

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

const AdminDoctors = () => {
  const { data, loading, error, execute: fetchDocs } = useApi(() => doctorApi.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Đa khoa',
    email: '',
    phoneNumber: '',
    consultationFee: 300000,
    experienceYears: 5
  });

  const handleAction = async (type, doctor) => {
    if (type === 'Xóa') {
      if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ bác sĩ ${doctor.name}?`)) {
        try {
          await doctorApi.delete(doctor.id);
          alert('Đã xóa thành công!');
          fetchDocs();
        } catch (err) {
          alert('Lỗi: ' + (err.response?.data?.message || 'Không thể xóa'));
        }
      }
      return;
    }
    
    if (type === 'Sửa') {
      setFormData({
        ...doctor,
        consultationFee: doctor.consultationFee || 300000,
        experienceYears: doctor.experienceYears || 5
      });
      setIsModalOpen(true);
      return;
    }

    console.log(`${type} doctor:`, doctor);
    alert(`Chức năng ${type} bác sĩ ${doctor.name} đang được phát triển.`);
  };

  const doctors = Array.isArray(data) ? data : (data?.data || []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await doctorApi.create(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        fetchDocs();
        setFormData({ name: '', specialization: 'Đa khoa', email: '', phoneNumber: '', consultationFee: 300000, experienceYears: 5 });
      }, 1500);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể tạo hồ sơ bác sĩ'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Đội ngũ Bác sĩ</h1>
          <p className="text-muted">Quản lý chuyên môn và lịch biểu của các bác sĩ.</p>
        </motion.div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> <span>Thêm Bác sĩ</span>
        </motion.button>
      </header>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-premium glass"
            >
              <div className="modal-header-p">
                <h3>Thêm hồ sơ Bác sĩ</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>

              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal">
                    <div className="success-icon-box"><Check size={40} /></div>
                    <h4>Đã cập nhật đội ngũ!</h4>
                    <p>Hồ sơ bác sĩ mới đã được lưu trữ thành công.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddDoctor} className="premium-form">
                    <div className="form-group-p">
                      <label>Họ và tên Bác sĩ</label>
                      <input
                        required type="text" placeholder="BS. Nguyễn Văn A"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1">
                        <label>Chuyên khoa</label>
                        <select
                          value={formData.specialization}
                          onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                        >
                          <option value="Nội tổng quát">Nội tổng quát</option>
                          <option value="Tim mạch">Tim mạch</option>
                          <option value="Nhi khoa">Nhi khoa</option>
                          <option value="Thần kinh">Thần kinh</option>
                          <option value="Da liễu">Da liễu</option>
                        </select>
                      </div>
                      <div className="form-group-p flex-1">
                        <label>Kinh nghiệm (năm)</label>
                        <input
                          type="number" value={formData.experienceYears}
                          onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1">
                        <label>Email</label>
                        <input
                          type="email" placeholder="doctor@hospital.vn"
                          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-p flex-1">
                        <label>Điện thoại</label>
                        <input
                          type="tel" placeholder="0901234567"
                          value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group-p">
                      <label>Phí khám (VNĐ)</label>
                      <input
                        type="number" step="10000"
                        value={formData.consultationFee} onChange={e => setFormData({ ...formData, consultationFee: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Quay lại</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Lưu hồ sơ'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="table-content mt-4">
        {loading ? (
          <LoadingState message="Đang kết nối danh sách bác sĩ..." />
        ) : error ? (
          <EmptyState isError title="Lỗi tải dữ liệu" message={error} onAction={fetchDocs} actionLabel="Tải lại" />
        ) : doctors.length === 0 ? (
          <EmptyState title="Trống" message="Chưa có bác sĩ nào trong danh sách." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <motion.div
                key={doc.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="card glass doctor-card-premium"
              >
                <div className="doc-card-top">
                  <div className="doc-avatar-large">
                    {doc.profileImageUrl ? (
                      <img src={doc.profileImageUrl?.startsWith('http') ? doc.profileImageUrl : `${API_GATEWAY_URL}${doc.profileImageUrl}`} alt={doc.name} />
                    ) : (
                      <div className="avatar-fallback">{doc.name?.split(' ').pop()?.[0] || 'D'}</div>
                    )}
                    <div className="status-online-dot"></div>
                  </div>
                  <div className="doc-main-info">
                    <h3 className="doc-name">{doc.name}</h3>
                    <div className="doc-spec-badge">
                      <Award size={14} /> <span>{doc.specialization}</span>
                    </div>
                  </div>
                </div>

                <div className="doc-stats-mini-grid">
                  <div className="doc-stat-item">
                    <Star size={16} className="text-warning fill-warning" />
                    <b>{doc.rating || 5.0}</b>
                    <span>Hài lòng</span>
                  </div>
                  <div className="doc-stat-item border-l">
                    <Briefcase size={16} className="text-info" />
                    <b>{doc.experienceYears || 1}</b>
                    <span>Năm nghề</span>
                  </div>
                </div>

                <div className="doc-contact-list">
                  <div className="contact-row">
                    <Mail size={16} /> <span>{doc.email || 'doctor@hospital.vn'}</span>
                  </div>
                  <div className="contact-row">
                    <Phone size={16} /> <span>{doc.phoneNumber || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="contact-row text-info">
                    <DollarSign size={16} /> <b>{doc.consultationFee?.toLocaleString()}đ</b> / lượt
                  </div>
                </div>

                <div className="doc-card-actions mt-6">
                  <button className="btn-icon-p blue" title="Xem lịch" onClick={() => handleAction('Xem lịch', doc)}><Calendar size={18} /></button>
                  <button className="btn-icon-p info" title="Sửa" onClick={() => handleAction('Sửa', doc)}><Edit size={18} /></button>
                  <button className="btn-icon-p red" title="Xóa" onClick={() => handleAction('Xóa', doc)}><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDoctors;
