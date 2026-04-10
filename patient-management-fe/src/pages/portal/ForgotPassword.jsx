
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import './Login.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // In a real app, this would send the OTP
      // For now, let's pretend it's sent
      setStep(2);
      setMessage({ type: 'success', text: 'Mã OTP đã được gửi đến email của bạn.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể gửi OTP. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setMessage({ type: 'success', text: 'Mật khẩu đã được đặt lại thành công.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Mã OTP không đúng hoặc đã hết hạn.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo">H</div>
          <h1>{step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}</h1>
          <p>{step === 1 ? 'Nhập email để nhận mã xác thực OTP' : 'Nhập mã OTP và mật khẩu mới của bạn'}</p>
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <form className="auth-form" onSubmit={step === 1 ? handleSendOTP : handleReset}>
          {step === 1 ? (
            <div className="form-group">
              <label>Email đăng ký</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Mã OTP (6 chữ số)</label>
                <div className="input-wrapper">
                  <ShieldCheck size={18} />
                  <input type="text" placeholder="123456" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : step === 1 ? 'Gửi mã OTP' : 'Xác nhận & Đặt lại'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Quay lại <Link to="/login" className="text-link">Đăng nhập</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
