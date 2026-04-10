
import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, RefreshCw, Filter, ChevronLeft, ChevronRight, MoreVertical, Search, CheckCircle2, AlertCircle, Loader2, Check, X, UserRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appointmentApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './AdminAppointments.css';

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const { data: rawAppointments, loading, error, execute: fetchApts } = useApi(() => appointmentApi.getAll());
  
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const doctors = ['BS. Minh', 'BS. Lan', 'BS. Hùng', 'BS. Phượng'];
  
  const appointments = rawAppointments || [];

  const handleConfirm = async (id) => {
    try {
      await appointmentApi.confirm(id);
      fetchApts();
      alert('Đã phê duyệt lịch hẹn!');
    } catch (err) {
      alert('Lỗi phê duyệt: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Bạn có chắc muốn từ chối lịch hẹn này?')) {
      try {
        await appointmentApi.reject(id);
        fetchApts();
      } catch (err) {
        alert('Lỗi từ chối: ' + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <span className="p-badge confirmed">Đã xác nhận</span>;
      case 'pending': return <span className="p-badge pending">Chờ duyệt</span>;
      case 'cancelled': return <span className="p-badge cancelled">Đã hủy</span>;
      case 'rejected': return <span className="p-badge cancelled">Từ chối</span>;
      case 'completed': return <span className="p-badge confirmed">Hoàn thành</span>;
      default: return <span className="p-badge pending">{status === 'PENDING' ? 'Chờ duyệt' : status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="appointments-page">
      <div className="page-header-premium flex-between mb-8">
        <div>
          <h1 className="text-gradient">Điều phối Lịch hẹn</h1>
          <p className="text-muted">Quản lý, phê duyệt và điều phối thời gian khám chữa bệnh.</p>
        </div>
        <div className="header-controls flex gap-4">
          <div className="search-box-mini"><Search size={16} /><input type="text" placeholder="Tìm bệnh nhân..." /></div>
          <button className="btn btn-secondary" onClick={fetchApts}><RefreshCw size={16} /> Làm mới</button>
        </div>
      </div>

      <div className="tabs-container-premium">
        <div className="tabs-nav">
          <button className={`tab-link ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => setActiveTab('grid')}>Tổng quan Grid</button>
          <button className={`tab-link ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Tất cả danh sách</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang đồng bộ lịch hẹn..." />
      ) : error ? (
        <EmptyState isError title="Lỗi tải lịch hẹn" message={error} onAction={fetchApts} />
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'grid' ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass p-0 overflow-hidden">
               <div className="calendar-grid">
                <div className="grid-header-row">
                  <div className="pivot-cell">Bác sĩ \ Giờ</div>
                  {timeSlots.map(time => <div key={time} className="time-header">{time}</div>)}
                </div>
                {doctors.map(docName => (
                  <div key={docName} className="grid-body-row">
                    <div className="doctor-cell">{docName}</div>
                    {timeSlots.map(time => {
                      const apt = appointments.find(a => (a.doctorName === docName || a.doc === docName) && (a.appointmentTime === time || a.time === time));
                      return (
                        <div key={time} className="appointment-cell">
                          {apt ? (
                            <div className={`appointment-pill ${apt.status?.toLowerCase()}`}>
                              <span className="p-name">{apt.patientName || apt.patient}</span>
                            </div>
                          ) : <div className="empty-cell-plus">+</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass">
              <div className="table-filters flex-between p-6">
                <div className="search-wrapper">
                  <Search size={18} className="search-icon" />
                  <input type="text" placeholder="Tìm kiếm bệnh án..." className="search-input" />
                </div>
                <button className="btn btn-secondary"><Filter size={18} /> <span>Lọc kết quả</span></button>
              </div>
              
              <div className="table-content">
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Bệnh nhân</th>
                        <th>Bác sĩ</th>
                        <th>Khung giờ</th>
                        <th>Trạng thái</th>
                        <th className="text-right">Hành động phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {appointments.map((apt) => (
                          <motion.tr key={apt.id || apt.appointmentId} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="table-row">
                            <td>
                              <div className="user-profile-cell">
                                <div className="avatar-box bg-primary-light text-primary">{(apt.patientName || apt.patient || 'P').charAt(0)}</div>
                                <div className="user-details">
                                  <span className="user-name">{apt.patientName || apt.patient}</span>
                                  <span className="user-id">ID: {(apt.id || apt.appointmentId || '').toString().substring(0, 8)}</span>
                                </div>
                              </div>
                            </td>
                            <td><div className="font-semibold text-primary">{apt.doctorName || apt.doc}</div></td>
                            <td>
                              <div className="contact-item">
                                <Clock size={14} className="text-info" />
                                <span className="font-bold">{apt.appointmentTime || apt.time}</span>
                                <span className="text-muted ml-2">({apt.appointmentDate || apt.date})</span>
                              </div>
                            </td>
                            <td>{getStatusBadge(apt.status)}</td>
                            <td className="text-right">
                              <div className="flex gap-2 justify-end">
                                {(apt.status?.toUpperCase() === 'PENDING' || !apt.status) && (
                                  <>
                                    <button onClick={() => handleConfirm(apt.id || apt.appointmentId)} className="btn-icon-p emerald" title="Phê duyệt"><Check size={16} /></button>
                                    <button onClick={() => handleReject(apt.id || apt.appointmentId)} className="btn-icon-p red" title="Từ chối"><X size={16} /></button>
                                  </>
                                )}
                                <button className="btn-icon-p info"><MoreVertical size={16} /></button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default AdminAppointments;
