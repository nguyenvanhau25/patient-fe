
import React, { useState } from 'react';
import { Search, Plus, Pill, ShieldAlert, Package, Trash2, Edit2, Image as ImageIcon, X, Loader2, Check, DollarSign, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pharmacyApi } from '../../utils/api';
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

const AdminPharmacy = () => {
  const { data: stockRaw, loading, error, execute: fetchStock } = useApi(() => pharmacyApi.getMedicines());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', manufacturer: '', quantity: 100, price: 50000, description: ''
  });
  
  const stock = stockRaw || [];

  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { label: 'Hết hàng', class: 'role-admin' };
    if (quantity < 100) return { label: 'Sắp hết', class: 'role-doctor' };
    return { label: 'Còn hàng', class: 'role-user' };
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await pharmacyApi.addMedicine(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        fetchStock();
        setFormData({ name: '', manufacturer: '', quantity: 100, price: 50000, description: '' });
      }, 1500);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể thêm thuốc'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Kho Dược phẩm</h1>
          <p className="text-muted">Quản lý nhập xuất và tồn kho thuốc y tế.</p>
        </motion.div>
        <motion.button 
          variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
          className="btn btn-primary" onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> <span>Thêm Thuốc mới</span>
        </motion.button>
      </header>

      {/* Add Medicine Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-premium glass">
              <div className="modal-header-p"><h3>Thêm Thuốc vào kho</h3><button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal"><div className="success-icon-box"><Check size={40} /></div><h4>Thành công!</h4><p>Dược phẩm đã được cập nhật vào kho.</p></div>
                ) : (
                  <form onSubmit={handleAddMedicine} className="premium-form">
                    <div className="form-group-p"><label>Tên biệt dược</label><input required placeholder="Paracetamol 500mg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="form-group-p"><label>Nhà sản xuất</label><input required placeholder="Hãng dược ABC" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} /></div>
                    <div className="form-row-p">
                      <div className="form-group-p flex-1"><label>Số lượng tồn</label><input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} /></div>
                      <div className="form-group-p flex-1"><label>Đơn giá (VNĐ)</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} /></div>
                    </div>
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Nhập kho'}</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { icon: <Pill />, label: 'Danh mục', value: stock.length, color: 'blue' },
          { icon: <ShieldAlert />, label: 'Sắp hết', value: stock.filter(s => s.quantity < 100).length, color: 'orange' },
          { icon: <Package />, label: 'Tồn kho', value: stock.reduce((acc, curr) => acc + curr.quantity, 0), color: 'emerald' },
          { icon: <Activity />, label: 'Hoạt chất', value: '128+', color: 'indigo' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className={`stat-card-mini-p ${stat.color}`}>
            <div className="stat-icon-m-p">{stat.icon}</div>
            <div className="stat-info-m-p"><span>{stat.label}</span><b>{stat.value}</b></div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="card glass">
        <div className="table-filters flex-between p-6">
          <div className="search-wrapper"><Search size={18} className="search-icon" /><input type="text" placeholder="Tìm tên thuốc, hãng..." className="search-input" /></div>
        </div>
        <div className="table-content">
          {loading ? <LoadingState message="Đang tải..." /> : error ? <EmptyState isError title="Lỗi" /> : stock.length === 0 ? <EmptyState title="Trống" /> : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead><tr><th>Dược phẩm</th><th>Nhà sản xuất</th><th>Tình trạng</th><th>Đơn giá</th><th className="text-right">Hành động</th></tr></thead>
                <tbody>{stock.map((item) => (
                  <motion.tr key={item.id} variants={itemVariants} className="table-row">
                    <td>
                      <div className="user-profile-cell">
                        <div className="avatar-box bg-slate-100"><ImageIcon size={18} /></div>
                        <div className="user-details"><span className="user-name">{item.name}</span><span className="user-id">ID: {item.id.substring(0, 8)}</span></div>
                      </div>
                    </td>
                    <td>{item.manufacturer || 'N/A'}</td>
                    <td><div className={`badge-role ${getStockStatus(item.quantity).class}`}>{getStockStatus(item.quantity).label} ({item.quantity})</div></td>
                    <td><b className="text-info">{item.price?.toLocaleString()}đ</b></td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="btn-icon-p info"><Edit2 size={16} /></button>
                        <button className="btn-icon-p red"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPharmacy;
