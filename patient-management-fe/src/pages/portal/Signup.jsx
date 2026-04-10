
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import './Login.css'; // Reusing premium split-screen styles

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signup(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Thông tin đăng ký không hợp lệ.');
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
              Gia nhập Cộng đồng <br /> <span>Hậu Anh Healthcare</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Chỉ mất vài phút để tạo tài khoản và bắt đầu <br />
              trải nghiệm dịch vụ y tế 5 sao của chúng tôi.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="branding-stats"
          >
            <div className="b-stat">
              <b>Nhanh</b>
              <span>Đăng ký dễ dàng</span>
            </div>
            <div className="b-stat">
              <b>Bảo mật</b>
              <span>Dữ liệu an toàn</span>
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
            <h2>Tạo tài khoản</h2>
            <p>Bắt đầu hành trình chăm sóc sức khỏe của bạn.</p>
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
              <label>Họ và Tên</label>
              <div className="premium-input-wrap">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Nguyễn Văn A" 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="premium-input-group">
              <label>Địa chỉ Email</label>
              <div className="premium-input-wrap">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="premium-input-group">
              <label>Số điện thoại</label>
              <div className="premium-input-wrap">
                <Phone size={18} className="input-icon" />
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="090 123 4567" 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="premium-input-group">
              <label>Mật khẩu</label>
              <div className="premium-input-wrap">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <>Đang tạo tài khoản <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Đăng ký ngay <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="form-footer">
            <span>Đã có tài khoản?</span>
            <Link to="/login" className="signup-link">Đăng nhập ngay</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
