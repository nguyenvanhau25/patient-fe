import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Filter, FileText, Trash2, Eye, Plus, X, Loader2, Check, Calendar, Phone, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { patientApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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

const AdminPatients = () => {
  const { data: rawPatients, loading, error, execute: fetchPatients } = useApi(() => patientApi.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', gender: 'Nam', dateOfBirth: '', phone: '', address: '', bloodType: 'O'
  });

  const patients = rawPatients || [];

  const filteredPatients = useMemo(() => {
    return patients.filter(p =>
      (p.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone || '').includes(searchTerm) ||
      (p.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await patientApi.create(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        fetchPatients();
        setFormData({ fullName: '', gender: 'Nam', dateOfBirth: '', phone: '', address: '', bloodType: 'O' });
      }, 1500);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể tạo hồ sơ'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Hồ sơ Bệnh nhân</h1>
          <p className="text-muted">Quản lý bệnh án điện tử và thông tin hành chính.</p>
        </motion.div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} /> <span>Tạo Hồ sơ mới</span>
        </motion.button>
      </header>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-premium glass">
              <div className="modal-header-p">
                <h3>Khởi tạo Hồ sơ Bệnh nhân</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal">
                    <div className="success-icon-box"><Check size={40} /></div>
                    <h4>Thành công!</h4>
                    <p>Bệnh nhân đã được đăng sổ y khoa.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddPatient} className="premium-form">
                    <div className="form-group-p"><label>Họ và tên</label><input required type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} /></div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1"><label>Giới tính</label><select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}><option value="Nam">Nam</option><option value="Nữ">Nữ</option></select></div>
                      <div className="form-group-p flex-1"><label>Ngày sinh</label><input required type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} /></div>
                    </div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1"><label>Số điện thoại</label><input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                      <div className="form-group-p flex-1"><label>Nhóm máu</label><select value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })}><option value="O">O</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option></select></div>
                    </div>
                    <div className="form-group-p"><label>Địa chỉ</label><input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Lưu Hồ sơ'}</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="card glass">
        <div className="table-filters flex-between p-6">
          <div className="search-wrapper"><Search size={18} className="search-icon" /><input type="text" placeholder="Tìm tên, mã BN hoặc SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" /></div>
          <button className="btn btn-secondary"><Filter size={18} /> <span>Lọc</span></button>
        </div>
        <div className="table-content">
          {loading ? <LoadingState message="Đang tải..." /> : error ? <EmptyState isError title="Lỗi" message={error} onAction={fetchPatients} /> : filteredPatients.length === 0 ? <EmptyState title="Kết quả trống" /> : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead><tr><th>Mã BN</th><th>Bệnh nhân</th><th>Ngày sinh</th><th>Giới tính</th><th>Liên hệ</th><th className="text-right">Hành động</th></tr></thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredPatients.map((p) => p && (
                      <motion.tr key={p.id} variants={itemVariants} layout className="table-row">
                        <td><span className="badge-role role-user">{p.id?.substring(0, 8) || 'N/A'}</span></td>
                        <td>
                          <div className="user-profile-cell">
                            <div className="avatar-box bg-info-light text-info">{(p.fullName || 'P').charAt(0)}</div>
                            <span className="user-name font-bold">{p.fullName || 'Bệnh nhân ẩn'}</span>
                          </div>
                        </td>
                        <td><div className="contact-item"><Calendar size={14} /> {p.dateOfBirth || p.dob || 'Chưa rõ'}</div></td>
                        <td>{p.gender || 'N/A'}</td>
                        <td><div className="contact-item"><Phone size={14} /> {p.phone || 'N/A'}</div></td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="btn-icon-p info" title="Xem chi tiết"><Eye size={16} /></button>
                            <button className="btn-icon-p blue" title="Hồ sơ lâm sàng"><FileText size={16} /></button>
                            <button className="btn-icon-p red" title="Xóa hồ sơ"><Trash2 size={16} /></button>
                          </div>
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

export default AdminPatients;
