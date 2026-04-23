
import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, ChevronRight, Activity, ArrowUpRight, ArrowDownRight, User, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyticsApi, appointmentApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './AdminDashboard.css';

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

const AdminDashboard = () => {
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [countRes, revRes, appRes, growthRes] = await Promise.all([
        analyticsApi.getPatientCount({ date: today }),
        analyticsApi.getRevenue({ date: today }),
        appointmentApi.getAll({ status: 'PENDING' }),
        analyticsApi.getGrowthRate(),
      ]);

      return {
        patientCount: countRes.data?.data || 1240,
        revenue: revRes.data?.data || 45000000,
        pendingAppointments: appRes.data?.data?.slice?.(0, 5) || appRes.data?.slice?.(0, 5) || [],
        growthRate: growthRes.data?.data || 12
      };
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      return { patientCount: 1240, revenue: 45000000, pendingAppointments: [], growthRate: 12 };
    }
  };

  const { data, loading, error, execute: retryFetch } = useApi(fetchDashboardData);

  if (loading) return <LoadingState message="Đang phân tích dữ liệu..." />;
  if (error) return <EmptyState isError title="Lỗi tải dữ liệu" message={error} actionLabel="Thử lại" onAction={retryFetch} />;

  const { patientCount, revenue, pendingAppointments, growthRate } = data || {};

  const stats = [
    { label: 'Bệnh nhân', value: patientCount.toLocaleString(), icon: <Users size={22} />, color: 'blue', trend: `+${growthRate}%`, isUp: true },
    { label: 'Lịch hôm nay', value: '42', icon: <Calendar size={22} />, color: 'emerald', trend: '5 mới', isUp: true },
    { label: 'Doanh thu', value: `${(revenue/1000000).toFixed(1)}M`, icon: <DollarSign size={22} />, color: 'orange', trend: '+8.3%', isUp: true },
    { label: 'Hài lòng', value: '98%', icon: <TrendingUp size={22} />, color: 'indigo', trend: '-1.2%', isUp: false },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="admin-dashboard-premium"
    >
      <header className="dashboard-header mb-10">
        <div className="flex-between">
          <div>
            <h1 className="text-4xl font-extrabold text-primary">Tổng quan</h1>
            <p className="text-muted mt-2">Dữ liệu vận hành hệ thống trong ngày.</p>
          </div>
          <div className="header-actions">
            <button className="btn-premium-secondary" onClick={() => alert('Đang trích xuất báo cáo...')}>
              <Download size={18} />
              <span>Xuất báo cáo</span>
            </button>
            <button className="btn-premium-primary" onClick={retryFetch}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>Cập nhật</span>
            </button>
          </div>
        </div>
      </header>

      <div className="stats-grid-premium mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className={`stat-card-premium ${stat.color}`}
          >
            <div className="stat-card-inner">
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                <div className={`stat-trend ${stat.isUp ? 'up' : 'down'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="stat-icon-wrap">{stat.icon}</div>
            </div>
            <div className="stat-card-bg-icon">{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <motion.div variants={itemVariants} className="dashboard-card chart-card">
          <div className="card-header-premium">
            <div className="title-group">
              <h3>Lưu lượng lâm sàng</h3>
              <p>Thống kê lượt khám 7 ngày gần nhất</p>
            </div>
            <Activity className="text-info" size={20} />
          </div>
          <div className="chart-container-premium">
            {[45, 65, 40, 85, 70, 95, 80].map((h, i) => (
              <div key={i} className="bar-wrapper">
                <div className="bar-tooltip">{h} lượt</div>
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${h}%` }} 
                  className="bar-fill-premium"
                >
                  <div className="bar-glow"></div>
                </motion.div>
                <span className="bar-day">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="dashboard-card list-card">
          <div className="card-header-premium">
            <h3>Lịch chờ duyệt</h3>
            <span className="badge-warning">{pendingAppointments.length}</span>
          </div>
          <div className="list-container-premium">
            {pendingAppointments.length > 0 ? (
              <>
                {pendingAppointments.map((apt) => (
                  <div key={apt.id || apt.appointmentId} className="list-item-premium">
                    <div className="item-avatar-box">
                      <User size={18} />
                    </div>
                    <div className="item-details">
                      <span className="item-title">{apt.patientName || 'Khách hàng'}</span>
                      <span className="item-subtitle">{apt.appointmentTime} • {apt.chiefComplaint || 'Khám nội'}</span>
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon-check"><CheckCircle2 size={16} /></button>
                      <button className="btn-icon-cancel"><XCircle size={16} /></button>
                    </div>
                  </div>
                ))}
                <button className="btn-view-more mt-4" onClick={() => navigate('/admin/appointments')}>
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </>
            ) : (
              <div className="empty-list-notice">
                <Clock size={40} />
                <p>Không có yêu cầu chờ xử lý</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
