
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, HeartPulse, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Branding Side */}
      <div className="login-branding-side">
        <div className="branding-overlay"></div>
        <div className="branding-content">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="branding-logo-box"
          >
            <Shield size={40} className="text-white" />
          </motion.div>
          
          <div className="branding-text">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Hệ thống Y tế <br /> <span>Hậu Anh Hospital</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Nền tảng quản lý y tế thông minh, <br />
              giúp bạn kết nối với bác sĩ mọi lúc, mọi nơi.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="branding-stats"
          >
            <div className="b-stat">
              <b>100k+</b>
              <span>Bệnh nhân</span>
            </div>
            <div className="b-stat">
              <b>500+</b>
              <span>Bác sĩ</span>
            </div>
            <div className="b-stat">
              <b>100%</b>
              <span>Uy tín</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="login-form-side">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="login-form-box"
        >
          <div className="form-header">
            <h2>Chào mừng trở lại</h2>
            <p>Vui lòng đăng nhập để quản lý sức khỏe của bạn.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="error-alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="premium-form" onSubmit={handleSubmit}>
            <div className="premium-input-group">
              <label>Địa chỉ Email</label>
              <div className="premium-input-wrap">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="user@hauanh.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="premium-input-group">
              <div className="flex-between">
                <label>Mật khẩu</label>
                <Link to="/forgot-password" size={14} className="forgot-link">Quên mật khẩu?</Link>
              </div>
              <div className="premium-input-wrap">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <>Đang đăng nhập <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Đăng nhập <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="form-footer">
            <span>Bạn mới đến Hậu Anh Hospital?</span>
            <Link to="/signup" className="signup-link">Đăng ký tài khoản</Link>
          </div>

          <div className="legal-links">
            <a href="#">Điều khoản</a>
            <span className="dot"></span>
            <a href="#">Chính sách bảo mật</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
