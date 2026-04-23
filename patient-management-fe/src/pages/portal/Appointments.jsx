
import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, History, User, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { appointmentApi } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const {
    data,
    loading,
    error,
    execute: fetchAppointments
  } = useApi(() => user?.userId ? appointmentApi.getAll({ patientId: user.userId }) : Promise.resolve({ data: [] }));

  const appointments = data || [];
  const upcomingApts = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const pastApts = appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CONFIRMED': return <span className="status-label green"><CheckCircle2 size={12} /> Đã xác nhận</span>;
      case 'PENDING': return <span className="status-label yellow"><AlertCircle size={12} /> Chờ duyệt</span>;
      case 'CANCELLED': return <span className="status-label red"><XCircle size={12} /> Đã hủy</span>;
      case 'COMPLETED': return <span className="status-label blue"><CheckCircle2 size={12} /> Đã hoàn thành</span>;
      default: return status;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="appointments-portal">
      <div className="container py-8">
        <header className="page-header-premium mb-10">
          <h1 className="text-3xl font-extrabold text-primary">Lịch khám</h1>
          <p className="text-muted mt-2">Quản lý các buổi hẹn của bạn.</p>

          <div className="portal-tabs-premium mt-8">
            <button className={`p-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>Sắp tới</button>
            <button className={`p-tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>Lịch sử</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState message="Đang kết nối dữ liệu lịch hẹn..." />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState isError title="Lỗi hệ thống" message={error} actionLabel="Thử lại" onAction={fetchAppointments} />
            </motion.div>
          ) : activeTab === 'upcoming' ? (
            <motion.div
              key="upcoming"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="upcoming-list"
            >
              {upcomingApts.length > 0 ? (
                upcomingApts.map((apt) => (
                  <motion.div key={apt.appointmentId} variants={itemVariants} className="apt-premium-card">
                    <div className="apt-card-side">
                      <div className="apt-date-box">
                        <span className="month">{new Date(apt.appointmentDate).toLocaleString('vi-VN', { month: 'short' })}</span>
                        <span className="day">{new Date(apt.appointmentDate).getDate()}</span>
                      </div>
                      <div className="apt-time-badge"><Clock size={12} /> {apt.appointmentTime}</div>
                    </div>

                    <div className="apt-card-main">
                      <div className="apt-card-header">
                        <div className="apt-reason">{apt.chiefComplaint}</div>
                        {getStatusLabel(apt.status)}
                      </div>

                      <div className="apt-details-grid">
                        <div className="apt-detail-item">
                          <User size={16} />
                          <div className="label-val">
                            <span className="label">Bác sĩ</span>
                            <span className="val">BS. {apt.doctorName || 'Hậu Anh'}</span>
                          </div>
                        </div>
                        <div className="apt-detail-item">
                          <MapPin size={16} />
                          <div className="label-val">
                            <span className="label">Địa điểm</span>
                            <span className="val">Phòng khám A-102, Tầng 1</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="apt-card-actions">
                      <button className="btn-portal-outline">Hủy lịch</button>
                      <button className="btn-portal-primary">Hướng dẫn</button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState icon={Calendar} title="Sẵn sàng cho cuộc hẹn mới?" message="Bạn hiện chưa có lịch khám nào sắp tới." actionLabel="Đặt lịch khám" onAction={() => navigate('/doctors')} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="past"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="past-history-list"
            >
              {pastApts.length > 0 ? (
                pastApts.map((apt) => (
                  <motion.div key={apt.appointmentId} variants={itemVariants} className="past-record-card">
                    <div className="past-main-info">
                      <span className="past-date">{new Date(apt.appointmentDate).toLocaleDateString('vi-VN')}</span>
                      <h4 className="past-reason-title">{apt.chiefComplaint}</h4>
                      <div className="past-meta">BS. {apt.doctorName} • {apt.appointmentTime}</div>
                    </div>
                    <div className="past-status-wrap">
                      {getStatusLabel(apt.status)}
                    </div>
                    <button className="btn-history-view">Chi tiết <ChevronRight size={16} /></button>
                  </motion.div>
                ))
              ) : (
                <EmptyState icon={History} title="Lịch sử trống" message="Bạn chưa có dữ liệu khám bệnh trước đó." />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Appointments;
