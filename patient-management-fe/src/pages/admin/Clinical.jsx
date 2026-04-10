
import React, { useState } from 'react';
import { Search, Plus, Clipboard, FileText, Download, X, Loader2, Check, User, Activity, Calendar, Stethoscope, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicalApi, patientApi } from '../../utils/api';
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

const Clinical = () => {
  const { data: recordsRaw, loading, error, execute: fetchRecords } = useApi(() => clinicalApi.getPatientRecords('all')); // Mocking 'all' or actual logic needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '', chiefComplaint: '', diagnosis: '', doctorName: '', appointmentDate: new Date().toISOString().split('T')[0]
  });

  const records = recordsRaw || [];

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await clinicalApi.createRecord(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        fetchRecords();
        setFormData({ patientId: '', chiefComplaint: '', diagnosis: '', doctorName: '', appointmentDate: new Date().toISOString().split('T')[0] });
      }, 1500);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể tạo bệnh án'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Bệnh án điện tử</h1>
          <p className="text-muted">Quản lý kết quả chẩn đoán và hồ sơ lâm sàng.</p>
        </motion.div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> <span>Tạo Bệnh án mới</span>
        </motion.button>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Clipboard />, title: 'Tra cứu', color: 'blue', desc: 'Mã BN hoặc ID hồ sơ', action: () => document.querySelector('.search-input')?.focus() },
          { icon: <Stethoscope />, title: 'Mẫu chuẩn', color: 'emerald', desc: 'Sử dụng AI chẩn đoán', action: () => alert('Tính năng Mẫu chuẩn AI đang được khởi tạo...') },
          { icon: <Download />, title: 'Báo cáo', color: 'indigo', desc: 'Xuất dữ liệu y khoa', action: () => alert('Hệ thống đang trích xuất dữ liệu PDF, vui lòng chờ...') },
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants} 
            className={`card glass quick-action-p ${item.color}`}
            onClick={item.action}
            whileHover={{ y: -5, cursor: 'pointer' }}
          >
            <div className="action-icon-p">{item.icon}</div>
            <div className="action-text-p">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Record Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-premium glass">
              <div className="modal-header-p"><h3>Khởi tạo Bệnh án</h3><button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal"><div className="success-icon-box"><Check size={40} /></div><h4>Thành công!</h4><p>Bệnh án đã được lưu trữ.</p></div>
                ) : (
                  <form onSubmit={handleAddRecord} className="premium-form">
                    <div className="form-group-p"><label>ID Bệnh nhân</label><input required placeholder="Nhập mã BN hoặc Email" value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })} /></div>
                    <div className="form-group-p"><label>Lý do khám</label><input required placeholder="Đau đầu, sốt..." value={formData.chiefComplaint} onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })} /></div>
                    <div className="form-group-p"><label>Chẩn đoán</label><textarea required rows={3} placeholder="Mô tả chẩn đoán chuyên sâu..." value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} /></div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1"><label>Bác sĩ điều trị</label><input required placeholder="BS. Nguyễn Văn A" value={formData.doctorName} onChange={e => setFormData({ ...formData, doctorName: e.target.value })} /></div>
                      <div className="form-group-p flex-1"><label>Ngày khám</label><input required type="date" value={formData.appointmentDate} onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })} /></div>
                    </div>
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Lưu Bệnh án'}</button>
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
          <div className="search-wrapper"><Search size={18} className="search-icon" /><input type="text" placeholder="Tìm kiếm bệnh án..." className="search-input" /></div>
        </div>
        <div className="table-content">
          {loading ? <LoadingState message="Đang tải..." /> : error ? <EmptyState isError title="Lỗi" /> : records.length === 0 ? <EmptyState title="Trống" message="Chưa có bệnh án được tạo." /> : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead><tr><th>Mã số</th><th>Bệnh nhân</th><th>Ngày khám</th><th>Chẩn đoán</th><th>Bác sĩ</th><th className="text-right">Hành động</th></tr></thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {records.map((rec) => rec && (
                      <motion.tr key={rec.id || rec.medicalRecordId} variants={itemVariants} className="table-row">
                        <td><span className="badge-role role-admin">{(rec.id || rec.medicalRecordId || 'N/A').toString().substring(0, 8)}</span></td>
                        <td><span className="font-bold">{rec.patientName || rec.patientId || 'Bệnh nhân ẩn'}</span></td>
                        <td><div className="contact-item"><Calendar size={14} /> {rec.appointmentDate || 'N/A'}</div></td>
                        <td><div className="badge-role role-doctor">{rec.diagnosis || 'Chưa chẩn đoán'}</div></td>
                        <td>{rec.doctorName || 'BS. Trực'}</td>
                        <td className="text-right"><button className="btn-icon-p info" title="Xem hồ sơ"><Eye size={16} /></button></td>
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

export default Clinical;
