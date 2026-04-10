
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, CalendarSearch, Activity, Pill, BarChart3, Settings, LogOut, ChevronDown, User, Shield, Bell, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from '../components/ui/ChatWidget';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'security', 'notifications'

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Quản lý User', path: '/admin/users' },
    { icon: <UserRound size={20} />, label: 'Bác sĩ', path: '/admin/doctors' },
    { icon: <Users size={20} />, label: 'Bệnh nhân', path: '/admin/patients' },
    { icon: <CalendarSearch size={20} />, label: 'Lịch hẹn', path: '/admin/appointments' },
    { icon: <Activity size={20} />, label: 'Lâm sàng', path: '/admin/clinical' },
    { icon: <Pill size={20} />, label: 'Dược', path: '/admin/pharmacy' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-premium mini">
            <Activity size={20} />
          </div>
          <div className="brand-texts">
            <span className="brand-name">HẬU ANH</span>
            <span className="brand-tagline">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item text-muted" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
            <span>Cài đặt</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header glass">
          <div className="header-search">
            <input type="text" placeholder="Tìm kiếm hệ thống..." />
          </div>

          <div className="header-right-actions">
            <button className="header-action-btn" onClick={() => setActiveModal('notifications')}>
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="header-profile-container">
              <button className="header-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="profile-info text-right">
                  <span className="name">Quản trị</span>
                </div>
                <div className="avatar">AD</div>
                <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="profile-dropdown glass">
                    <div className="dropdown-header">
                      <b>Tài khoản quản trị</b>
                      <span>admin@hospital.vn</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => { setActiveModal('profile'); setIsProfileOpen(false); }}><User size={16} /> Hồ sơ cá nhân</button>
                    <button className="dropdown-item" onClick={() => { setActiveModal('security'); setIsProfileOpen(false); }}><Shield size={16} /> Bảo mật</button>
                    <Link to="/" className="dropdown-item text-primary" onClick={() => setIsProfileOpen(false)}><UserRound size={16} /> Màn hình người dùng</Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}><LogOut size={16} /> Thoát hệ thống</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-premium glass" style={{ maxWidth: '500px' }}>
              <div className="modal-header-p">
                <h3>Cài đặt Hệ thống</h3>
                <button className="close-btn" onClick={() => setIsSettingsOpen(false)}><X size={20} /></button>
              </div>
              <div className="modal-body-p">
                <div className="settings-list">
                  <div className="setting-item flex-between p-3 border-b border-slate-100">
                    <div><h4 className="font-bold">Chế độ bảo trì</h4><p className="text-xs text-muted">Tạm ngưng các dịch vụ đặt lịch</p></div>
                    <div className="toggle-box">OFF</div>
                  </div>
                  <div className="setting-item flex-between p-3 border-b border-slate-100">
                    <div><h4 className="font-bold">Thông báo Email</h4><p className="text-xs text-muted">Gửi xác nhận khi có lịch hẹn mới</p></div>
                    <div className="toggle-box on">ON</div>
                  </div>
                </div>
                <div className="modal-actions-p mt-6"><button className="btn-submit w-full" onClick={() => setIsSettingsOpen(false)}>Lưu thay đổi</button></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Placeholder Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-premium glass" style={{ maxWidth: '500px' }}>
              <div className="modal-header-p">
                <h3>{activeModal === 'profile' ? 'Hồ sơ Admin' : activeModal === 'security' ? 'Cài đặt Bảo mật' : 'Trung tâm Thông báo'}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}><X size={20} /></button>
              </div>
              <div className="modal-body-p">
                <div className="placeholder-content-p text-center py-10">
                  <div className="success-icon-box mb-4 mx-auto" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                    {activeModal === 'profile' ? <User size={30} /> : activeModal === 'security' ? <Shield size={30} /> : <Bell size={30} />}
                  </div>
                  <h4 className="font-bold text-lg mb-2">Module {activeModal === 'profile' ? 'Hồ sơ' : activeModal === 'security' ? 'Bảo mật' : 'Thông báo'}</h4>
                  <p className="text-muted px-6">Trang này đang được thiết kế giao diện chi tiết. Bạn có thể quay lại sau để cập nhật thông tin.</p>
                </div>
                <div className="modal-actions-p mt-4">
                  <button className="btn-submit w-full" onClick={() => setActiveModal(null)}>Đóng</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatWidget />
    </div>
  );
};

export default AdminLayout;
