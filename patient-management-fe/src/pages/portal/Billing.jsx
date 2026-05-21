import React, { useEffect, useState } from 'react';
import { Plus, History, ArrowUpRight, ArrowDownLeft, Loader2, X, CheckCircle, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { billingApi } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import './Billing.css';

const Billing = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('500000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Dùng patientId (từ patient-service) thay vì userId (từ auth-service)
      const patientId = user?.patientId;
      if (!patientId) {
        setAccount(null);
        setTransactions([]);
        setError('Không tìm thấy hồ sơ bệnh nhân liên kết với tài khoản này. Vui lòng liên hệ quản trị viên để tạo hồ sơ.');
        setLoading(false);
        return;
      }

      const accRes = await billingApi.getAccountByPatientId(patientId);
      const accData = accRes.data?.data || accRes.data;

      if (!accData) {
        setAccount(null);
        setTransactions([]);
        return;
      }

      setAccount(accData);

      const txRes = await billingApi.getTransactions(accData.id);
      setTransactions(txRes.data?.data || txRes.data || []);
    } catch (err) {
      console.error('Failed to fetch billing data:', err);
      setAccount(null);
      setTransactions([]);

      if (err.response?.status === 404) {
        setError('Chưa có tài khoản ví cho người dùng này.');
      } else {
        setError('Không thể kết nối đến Billing Service. Vui lòng kiểm tra backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleRecharge = async () => {
    if (!account?.id || !rechargeAmount || isNaN(rechargeAmount)) return;

    setIsSubmitting(true);
    try {
      await billingApi.recharge(account.id, parseInt(rechargeAmount, 10));
      setSuccess(true);
      setTimeout(() => {
        setShowRechargeModal(false);
        setSuccess(false);
        setIsSubmitting(false);
        fetchData();
      }, 2000);
    } catch {
      alert('Nạp tiền thất bại. Lỗi kết nối.');
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="billing-portal-premium">
      <div className="container py-8">
        <header className="page-header-premium mb-10">
          <h1 className="text-3xl font-extrabold text-primary">Ví tiền</h1>
          <p className="text-muted mt-2">Quản lý số dư và giao dịch.</p>
        </header>

        {loading ? (
          <div className="flex-center py-20 flex-col gap-4">
            <Loader2 className="animate-spin text-info" size={48} />
            <p className="font-bold text-muted">Đang cập nhật số dư...</p>
          </div>
        ) : error ? (
          <div className="error-card glass p-10 flex-center flex-col text-center">
            <AlertCircle size={60} className="text-danger mb-4" />
            <p className="text-xl font-bold text-primary mb-2">Chưa tải được dữ liệu ví</p>
            <p className="text-muted max-w-md">{error}</p>
            <button className="btn-portal-primary mt-6" onClick={fetchData}>Thử lại ngay</button>
          </div>
        ) : (
          <div className="billing-grid">
            <div className="billing-left">
              <div className="premium-visa-card">
                <div className="card-top">
                  <div className="card-chip"></div>
                  <div className="card-type">HAU ANH PAY</div>
                </div>
                <div className="card-balance-section">
                  <span className="balance-label">SỐ DƯ</span>
                  <div className="balance-value">
                    {(account?.balance || 0).toLocaleString()} <span className="currency">đ</span>
                  </div>
                </div>
                <div className="card-bottom">
                  <div className="card-holder">
                    <span className="holder-label">CHỦ VÍ</span>
                    <span className="holder-name">{account?.name || user?.fullName || 'PATIENT'}</span>
                  </div>
                  <div className="card-logo">
                    <div className="circles"><span></span><span></span></div>
                  </div>
                </div>
              </div>

              <div className="quick-stats-row mt-6">
                <div className="stat-p-card">
                  <div className="stat-p-icon blue"><Zap size={18} /></div>
                  <div className="stat-p-info">
                    <span className="label">Đã chi</span>
                    <span className="value">
                      {transactions.filter(t => t.type !== 'RECHARGE').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}đ
                    </span>
                  </div>
                </div>
                <div className="stat-p-card">
                  <div className="stat-p-icon green"><ShieldCheck size={18} /></div>
                  <div className="stat-p-info">
                    <span className="label">Trạng thái</span>
                    <span className="value text-success">{account?.status || 'ACTIVE'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="billing-right">
              <div className="section-header-premium flex-between mb-6">
                <h3 className="text-lg font-extrabold text-primary flex-center gap-2">
                  <History size={20} className="text-info" /> Lịch sử giao dịch
                </h3>
                <button className="btn-portal-outline btn-sm">Tải báo cáo</button>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="transaction-scroll-list"
              >
                {transactions.length > 0 ? transactions.map((tx) => (
                  <motion.div key={tx.id} variants={itemVariants} className="tx-p-item">
                    <div className={`tx-p-icon ${tx.type === 'CREDIT' || tx.type === 'IN' || tx.type === 'RECHARGE' || tx.type === 'PAYMENT' ? 'in' : 'out'}`}>
                      {tx.type === 'CREDIT' || tx.type === 'IN' || tx.type === 'RECHARGE' || tx.type === 'PAYMENT'
                        ? <ArrowDownLeft size={20} />
                        : <ArrowUpRight size={20} />}
                    </div>
                    <div className="tx-p-main">
                      <div className="tx-p-title">{tx.description || tx.type}</div>
                      <div className="tx-p-date">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        {' · '}<span style={{ color: tx.status === 'COMPLETED' ? 'var(--success)' : tx.status === 'FAILED' ? 'var(--danger)' : 'var(--warning)' }}>{tx.status}</span>
                      </div>
                    </div>
                    <div className={`tx-p-amount ${tx.type === 'PAYMENT' || tx.type === 'RECHARGE' ? 'in' : 'out'}`}>
                      {tx.type === 'PAYMENT' || tx.type === 'RECHARGE' ? '+' : '-'}{Math.abs(tx.amount || 0).toLocaleString()}đ
                    </div>
                  </motion.div>
                )) : (
                  <div className="no-tx-state py-12 text-center flex-center flex-col">
                    <div className="no-tx-icon"><History size={40} /></div>
                    <p className="font-bold text-muted mt-4">Chưa có giao dịch phát sinh</p>
                  </div>
                )}
              </motion.div>

              <button className="btn-recharge-premium mt-8" onClick={() => setShowRechargeModal(true)} disabled={!account?.id}>
                <Plus size={20} /> Nạp thêm tiền vào ví
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showRechargeModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="modal-premium-content glass"
            >
              {!success ? (
                <>
                  <div className="modal-premium-header">
                    <h3>Nạp tiền vào Hậu Anh Pay</h3>
                    <button onClick={() => setShowRechargeModal(false)} className="close-modal"><X size={24} /></button>
                  </div>
                  <div className="recharge-premium-body">
                    <p className="text-muted text-sm mb-6">Chọn mệnh giá hoặc nhập số tiền tùy chỉnh.</p>
                    <div className="amount-p-presets mb-6">
                      {['200000', '500000', '1000000', '2000000'].map((amt) => (
                        <button
                          key={amt}
                          className={`amt-p-btn ${rechargeAmount === amt ? 'active' : ''}`}
                          onClick={() => setRechargeAmount(amt)}
                        >
                          {parseInt(amt, 10).toLocaleString()}đ
                        </button>
                      ))}
                    </div>
                    <div className="custom-p-input mb-8">
                      <label>Số tiền muốn nạp (VND)</label>
                      <input type="number" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} placeholder="Nhập số tiền..." />
                    </div>
                    <button className="btn-portal-primary w-full py-4 text-base" onClick={handleRecharge} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="animate-spin" /> : 'Xác nhận thanh toán'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="success-premium-state py-10">
                  <div className="success-icon-ring"><CheckCircle size={60} /></div>
                  <h3>Giao dịch thành công!</h3>
                  <p className="text-muted">Số dư của bạn đã được cập nhật ngay lập tức.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Billing;