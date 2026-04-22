
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, HeartPulse, Wallet, User, Bell, Shield, Menu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatWidget from '../components/ui/ChatWidget';
import Footer from '../components/ui/Footer';
import './PortalLayout.css';

const PortalLayout = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} />, label: 'Trang chủ', path: '/' },
    { icon: <Search size={20} />, label: 'Tìm bác sĩ', path: '/doctors' },
    { icon: <Calendar size={20} />, label: 'Lịch hẹn', path: '/appointments' },
    { icon: <HeartPulse size={20} />, label: 'Sức khỏe', path: '/health' },
    { icon: <Wallet size={20} />, label: 'Tài chính', path: '/billing' },
  ];

  return (
    <div className="portal-layout">
      <header className="portal-header glass">
        <div className="container header-content">
          <div className="portal-brand" onClick={() => (window.location.href = '/')}>
            <div className="brand-logo-premium">
              <Activity size={25} />
              <div className="logo-cross"></div>
            </div>
            <div className="brand-texts" >
              <span className="brand-name" >HẬU ANH</span>
              <span className="brand-tagline">HEALTHCARE HOSPITAL</span>
            </div>
          </div>

          <nav className="header-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="icon-wrap">{item.icon}</span>
                <span className="label-wrap">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div layoutId="nav-underline" className="nav-underline" />
                )}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/admin" className="admin-access-btn" title="Quản trị viên">
              <Shield size={18} />
            </Link>
            <button className="action-circle-btn">
              <Bell size={20} />
              <span className="notify-dot"></span>
            </button>
            <Link to="/profile" className="profile-btn">
              <div className="avatar-mini">HA</div>
            </Link>
          </div>
        </div>
      </header>

      <main className="portal-main">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="page-wrapper"
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />

      {/* Mobile Bar */}
      <nav className="mobile-dock glass">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`dock-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span className="dock-label">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
        <Link to="/profile" className={`dock-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <User size={20} />
          <span className="dock-label">Tôi</span>
        </Link>
      </nav>

      <ChatWidget />
    </div>
  );
};

export default PortalLayout;
