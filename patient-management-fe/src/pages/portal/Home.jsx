
import React, { useEffect, useState } from 'react';
import { Search, Star, ChevronRight, Activity, Heart, Users, Clock, Check, ArrowRight, Stethoscope, Baby, Pill as PillIcon } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../utils/api';
import './Home.css';

import heroDoctor from '../../assets/hero-doctor.png';

// Reusable animated section wrapper
const AnimSection = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children wrapper
const StaggerGrid = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const Home = () => {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 1, label: 'Nội khoa', icon: <Activity size={22} />, color: '#eff6ff', stroke: '#0284c7', spec: 'Internal Medicine', desc: 'Sức khỏe tổng quát', count: '120 bác sĩ', countColor: '#0284c7', countBg: '#f0f9ff' },
    { id: 2, label: 'Tim mạch', icon: <Heart size={22} />, color: '#fef2f2', stroke: '#dc2626', spec: 'Cardiology', desc: 'Chăm sóc trái tim', count: '84 bác sĩ', countColor: '#b91c1c', countBg: '#fef2f2' },
    { id: 3, label: 'Nhi khoa', icon: <Baby size={22} />, color: '#fffbeb', stroke: '#d97706', spec: 'Pediatrics', desc: 'Sức khỏe trẻ em', count: '65 bác sĩ', countColor: '#92400e', countBg: '#fffbeb' },
    { id: 4, label: 'Dược lý', icon: <PillIcon size={22} />, color: '#f0fdf4', stroke: '#059669', spec: 'General', desc: 'Thuốc & Điều trị', count: '42 bác sĩ', countColor: '#065f46', countBg: '#f0fdf4' },
  ];

  const stats = [
    { icon: <Users size={20} />, iconBg: '#f0f9ff', iconColor: '#0284c7', value: '500+', label: 'Bác sĩ chuyên khoa' },
    { icon: <Star size={20} />, iconBg: '#fef9c3', iconColor: '#ca8a04', value: '4.9/5', label: 'Đánh giá trung bình' },
    { icon: <Activity size={20} />, iconBg: '#f0fdf4', iconColor: '#059669', value: '50,000+', label: 'Bệnh nhân điều trị' },
    { icon: <Clock size={20} />, iconBg: '#fdf2f8', iconColor: '#9333ea', value: '24/7', label: 'Hỗ trợ liên tục' },
  ];

// Mock data removed. Relying on API.

  const news = [
    { id: 1, img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', tag: 'Sự kiện', tagColor: '#0284c7', date: '12 Tháng 4, 2026', title: 'Khánh thành trung tâm robot phẫu thuật Da Vinci thế hệ mới', excerpt: 'Ứng dụng công nghệ hàng đầu trong phẫu thuật ít xâm lấn, mang lại độ chính xác tối ưu cho bệnh nhân.' },
    { id: 2, img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80', tag: 'Y học', tagColor: '#7c3aed', date: '10 Tháng 4, 2026', title: 'Tầm soát ung thư sớm: Chìa khóa vàng bảo vệ sức khỏe gia đình bạn', excerpt: 'Tầm soát định kỳ giúp phát hiện sớm và điều trị hiệu quả, kéo dài tuổi thọ đáng kể.' },
    { id: 3, img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80', tag: 'Cộng đồng', tagColor: '#059669', date: '08 Tháng 4, 2026', title: 'Khám bệnh miễn phí cho người cao tuổi tại miền Trung', excerpt: 'Hơn 500 suất khám bệnh và cấp thuốc miễn phí trao đến người cao tuổi trong hành trình nhân ái.' },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorApi.getTopRated();
        if (res.data && res.data.data && res.data.data.length > 0) setTopDoctors(res.data.data.slice(0, 4));
        else setTopDoctors([]);
      } catch (err) {
        console.error('Home fetch error:', err);
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend.');
        setTopDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="hero-badge">
            <Check size={12} />
            Hệ thống y tế đạt tiêu chuẩn quốc tế
          </div>
          <h1>Chăm sóc sức khỏe<br /><span className="hero-accent">tận tâm &amp; tinh hoa</span></h1>
          <p className="hero-sub">Kết nối với đội ngũ chuyên gia y tế hàng đầu. Đặt lịch khám nhanh chóng, nhận tư vấn chuyên sâu ngay tại nhà bạn.</p>
          <motion.div
            className="search-bar"
            onClick={() => navigate('/doctors')}
            whileHover={{ borderColor: '#0ea5e9', scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Search size={16} className="search-icon-inner" />
            <input type="text" placeholder="Tìm tên bác sĩ hoặc chuyên khoa..." readOnly />
            <button>Tìm kiếm</button>
          </motion.div>
          {/* <motion.div
            className="hero-stats-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="h-stat"><b>500+</b><span>Chuyên gia</span></div>
            <div className="h-stat-divider"></div>
            <div className="h-stat"><b>24/7</b><span>Hỗ trợ</span></div>
            <div className="h-stat-divider"></div>
            <div className="h-stat"><b>98%</b><span>Hài lòng</span></div>
          </motion.div> */}
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <motion.div
            className="doctor-card-main"
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.25 }}
          >
            <div className="doctor-avatar-box">
              <img src={heroDoctor} alt="Bác sĩ Hậu Anh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="online-badge"><div className="online-dot"></div>Đang khám trực tuyến</div>
            <div className="dc-name">TS. BS. Nguyễn Minh Khoa</div>
            <div className="dc-spec">Tim mạch · Nội khoa</div>
            <div className="dc-stars">★★★★★<span>5.0 (142 đánh giá)</span></div>
          </motion.div>

          <motion.div className="float-card float-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="float-icon fi-blue"><Activity size={16} color="#0284c7" /></div>
            <div><div className="float-label">Chỉ số sức khỏe</div><div className="float-val">Tốt — 96%</div></div>
          </motion.div>
          <motion.div className="float-card float-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 }}>
            <div className="float-icon fi-green"><Clock size={16} color="#059669" /></div>
            <div><div className="float-label">Lịch hẹn sắp tới</div><div className="float-val">10:30 SA — Mai</div></div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAND ── */}
      <AnimSection delay={0.1}>
        <div className="stats-band">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-box"
              style={{ borderRight: i < stats.length - 1 ? '0.5px solid #e5e7eb' : 'none' }}
              whileHover={{ backgroundColor: '#f8fafc' }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-icon-box" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
              <div><b>{s.value}</b><p>{s.label}</p></div>
            </motion.div>
          ))}
        </div>
      </AnimSection>

      {/* ── SPECIALIZATIONS ── */}
      <div className="home-section">
        <AnimSection>
          <div className="section-head">
            <div><div className="section-title">Dịch vụ y khoa</div><div className="section-sub">Tiếp cận các chuyên khoa mũi nhọn tại Hậu Anh</div></div>
          </div>
        </AnimSection>
        <StaggerGrid className="spec-grid-clean">
          {categories.map(cat => (
            <motion.div
              key={cat.id}
              variants={fadeUp}
              className="spec-card-clean"
              whileHover={{ borderColor: '#0ea5e9', y: -3, boxShadow: '0 4px 16px rgba(14,165,233,0.08)' }}
              onClick={() => navigate(`/doctors?specialization=${cat.spec}`)}
            >
              <div className="spec-icon" style={{ background: cat.color, color: cat.stroke }}>{cat.icon}</div>
              <h3>{cat.label}</h3>
              <p>{cat.desc}</p>
              <span className="spec-count" style={{ color: cat.countColor, background: cat.countBg }}>{cat.count}</span>
            </motion.div>
          ))}
        </StaggerGrid>
      </div>

      {/* ── DOCTORS ── */}
      <div className="bg-soft-clean">
        <div className="bg-soft-clean-inner">
          <AnimSection>
            <div className="section-head">
              <div><div className="section-title">Chuyên gia hàng đầu</div><div className="section-sub">Bác sĩ tu nghiệp nước ngoài, giàu kinh nghiệm</div></div>
            </div>
          </AnimSection>
          <div className="doctors-row">
            {topDoctors.length > 0 ? topDoctors.map(d => ({
              id: d.id, 
              initials: d.name ? d.name.split(' ').slice(-2).map(w => w[0]).join('') : 'BS', 
              color: '#0ea5e9',
              spec: d.specialization || 'Đa khoa', 
              name: d.name || 'Bác sĩ ẩn danh', 
              rating: d.rating || 4.9, 
              reviews: d.reviewCount || 0, 
              patients: d.reviewCount || 0
            })).map((doc, i) => (
              <motion.div
                key={doc.id || i}
                className="doc-card-clean"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ borderColor: '#0ea5e9', y: -4 }}
                onClick={() => navigate(`/doctor/${doc.id}`)}
              >
                <div className="doc-ava" style={{ background: doc.color }}>{doc.initials}</div>
                <div className="doc-spec-tag">{doc.spec}</div>
                <div className="doc-name-clean">{doc.name}</div>
                <div className="doc-rating-row">★ {doc.rating} <span>({doc.reviews} đánh giá)</span></div>
                <div className="doc-pts">· {doc.patients} bệnh nhân</div>
                <button className="doc-book-btn" onClick={e => { e.stopPropagation(); navigate(`/doctor/${doc.id}`); }}>Đặt lịch khám</button>
              </motion.div>
            )) : (
              <div className="no-data-notice-premium">
                {error ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend.' : 'Hiện chưa có bác sĩ nào trực tuyến.'}
              </div>
            )}
            <motion.div
              className="doc-card-clean doc-more"
              whileHover={{ borderColor: '#0ea5e9' }}
              onClick={() => navigate('/doctors')}
            >
              <div className="more-circle">→</div>
              <div>Xem thêm bác sĩ</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── NEWS ── */}
      <div className="home-section">
        <AnimSection>
          <div className="section-head">
            <div><div className="section-title">Tin tức &amp; sự kiện</div><div className="section-sub">Cập nhật hoạt động mới nhất tại Hậu Anh Hospital</div></div>
            <button className="btn-link">Xem tất cả <ArrowRight size={14} /></button>
          </div>
        </AnimSection>
        <StaggerGrid className="news-grid-clean">
          {news.map(n => (
            <motion.div key={n.id} variants={fadeUp} className="news-card-clean" whileHover={{ borderColor: '#0ea5e9', y: -3 }}>
              <div className="news-img-placeholder">
                <img src={n.img} alt={n.title} />
                <div className="news-tag-badge" style={{ color: n.tagColor }}>{n.tag}</div>
              </div>
              <div className="news-body-clean">
                <div className="news-date-clean">{n.date}</div>
                <div className="news-title-clean">{n.title}</div>
                <div className="news-excerpt-clean">{n.excerpt}</div>
                <button className="news-more-btn">Đọc tiếp →</button>
              </div>
            </motion.div>
          ))}
        </StaggerGrid>
      </div>

      {/* ── CTA ── */}
      <AnimSection delay={0.1}>
        <motion.div
          className="cta-banner"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.25 }}
        >
          <div>
            <h2>Sẵn sàng chăm sóc sức khỏe của bạn?</h2>
            <p>Đặt lịch với chuyên gia ngay hôm nay — nhanh chóng, dễ dàng, an toàn.</p>
          </div>
          <motion.button
            className="cta-book-btn"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/doctors')}
          >
            Đặt lịch khám ngay
          </motion.button>
        </motion.div>
      </AnimSection>

    </div>
  );
};

export default Home;
