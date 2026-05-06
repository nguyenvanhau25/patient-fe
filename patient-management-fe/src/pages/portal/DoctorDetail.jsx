
import React, { useEffect, useState } from 'react';
import { Star, MapPin, Award, Calendar, Clock, ChevronRight, Phone, MessageSquare, Loader2, X, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { doctorApi, appointmentApi, patientApi } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import './DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docRes, revRes] = await Promise.all([
        doctorApi.getDetails(id),
        doctorApi.getReviews(id)
      ]);
      setDoctor(docRes.data.data || docRes.data);
      setReviews(revRes.data.data || revRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (bookingStep === 2 && user && !patientInfo) {
      const fetchPatient = async () => {
        try {
          const pRes = await patientApi.getProfile(user.userId);
          setPatientInfo(pRes.data.data || pRes.data);
        } catch (err) {
          setPatientInfo({ fullName: user.fullName || user.email || 'Bệnh nhân' });
        }
      };
      fetchPatient();
    }
  }, [bookingStep, user]);

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    setIsSubmitting(true);
    try {
      await appointmentApi.create({
        patientId: user.userId,
        doctorId: id,
        appointmentDate: new Date().toISOString().split('T')[0],
        startTime: selectedTime,
        endTime: (parseInt(selectedTime.split(':')[0]) + 1).toString().padStart(2, '0') + ':00',
        // chiefComplaint // Bỏ đi vì backend ko hỗ trợ
      });
      alert('Đặt lịch thành công!');
      navigate('/appointments');
    } catch (err) {
      alert('Đã xảy ra lỗi khi đặt lịch. Kiểm tra kết nối.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <Loader2 className="animate-spin" size={40} />
      <p>Đang tải thông tin bác sĩ...</p>
    </div>
  );

  if (error || !doctor) return (
    <div className="no-data-full" style={{ padding: '4rem' }}>
      <AlertCircle size={40} color="var(--danger)" />
      <p className="text-muted m-t-1">{error || 'Không tìm thấy thông tin bác sĩ.'}</p>
      <button className="btn-secondary m-t-1" onClick={() => navigate('/doctors')}>Quay lại tìm kiếm</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="doctor-detail-container">
      <div className="detail-header glass card">
        <div className="doc-profile-main">
          <div className="doc-avatar-large">
            {doctor.profileImageUrl ? <img src={doctor.profileImageUrl} alt={doctor.name} /> : doctor.name?.charAt(0)}
          </div>
          <div className="doc-titles">
            <h1>{doctor.name}</h1>
            <p className="spec">{doctor.specialization}</p>
            <div className="tags">
              <span className="tag"><Award size={14} /> {doctor.experienceYears || 5} năm kinh nghiệm</span>
              <span className="tag"><Star size={14} className="fill-star" /> {doctor.rating || 5.0} ({reviews.length} đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-left">
          <section className="detail-section card glass">
            <h3>Giới thiệu</h3>
            <p>{doctor.biography || 'Đang cập nhật thông tin giới thiệu bác sĩ...'}</p>
          </section>

          <section className="detail-section card glass">
            <div className="flex-between m-b-1">
              <h3>Đánh giá từ bệnh nhân</h3>
              <button className="btn-text" onClick={() => setShowReviewModal(true)}>Viết đánh giá</button>
            </div>
            <div className="reviews-list">
              {reviews.length > 0 ? reviews.map((rev) => (
                <div key={rev.id} className="review-item-v2">
                  <div className="flex-between">
                    <div className="reviewer-info">
                      <strong>Người dùng {rev.patientId}</strong>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < rev.rating ? 'fill-star' : 'empty-star'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{rev.reviewText}</p>
                </div>
              )) : <p className="text-muted">Chưa có đánh giá nào.</p>}
            </div>
          </section>
        </div>

        <div className="detail-right">
          <section className="booking-card card glass">
            <h3>Đặt lịch khám</h3>
            <AnimatePresence mode="wait">
              {bookingStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step1">
                  <div className="date-selector">
                    <p className="label">Chọn thời gian (Hôm nay)</p>
                    <div className="time-grid">
                      {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map((time) => (
                        <button key={time} className={`time-btn ${selectedTime === time ? 'active' : ''}`} onClick={() => setSelectedTime(time)}>{time}</button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-confirm-booking" disabled={!selectedTime} onClick={() => setBookingStep(2)}>Tiếp theo</button>
                </motion.div>
              )}
              {bookingStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step2">
                  <p className="label">Xác nhận thông tin</p>
                  <div className="patient-confirm-card">
                    <p><strong>Ngày:</strong> Hôm nay, {selectedTime}</p>
                    <p><strong>Khách:</strong> {patientInfo?.fullName || user?.email}</p>
                  </div>
                  <button className="btn-confirm-booking" onClick={() => setBookingStep(3)}>Đồng ý & Tiếp tục</button>
                  <button className="btn-back" onClick={() => setBookingStep(1)}>Quay lại</button>
                </motion.div>
              )}
              {bookingStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step3">
                  <p className="label">Lý do khám bệnh</p>
                  <textarea placeholder="Triệu chứng của bạn..." value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="booking-textarea" />
                  <div className="price-summary">
                    <span>Phí tư vấn:</span>
                    <span className="price">{doctor.consultationFee ? `${doctor.consultationFee.toLocaleString()}đ` : '500.000đ'}</span>
                  </div>
                  <button className="btn-confirm-booking" onClick={handleBooking} disabled={isSubmitting || !chiefComplaint}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Xác nhận đặt lịch'}
                  </button>
                  <button className="btn-back" onClick={() => setBookingStep(2)}>Quay lại</button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      {showReviewModal && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="modal-content glass">
            <div className="modal-header"><h3>Đánh giá bác sĩ</h3><button onClick={() => setShowReviewModal(false)}><X size={24} /></button></div>
            <div className="rating-selector">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={28} className={s <= newReview.rating ? 'fill-star clickable' : 'empty-star clickable'} onClick={() => setNewReview({...newReview, rating: s})} />)}</div>
            <textarea placeholder="Chia sẻ cảm nghĩ..." value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} className="review-textarea" />
            <button className="btn-primary-full" onClick={() => {}} disabled={isSubmitting}>Gửi đánh giá</button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DoctorDetail;
