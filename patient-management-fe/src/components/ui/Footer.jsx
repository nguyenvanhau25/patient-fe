
import React from 'react';
import { Activity, Phone, Mail, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        {/* Brand */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Activity size={18} />
            </div>
            <span className="footer-logo-name">Hậu<span>Anh</span> Hospital</span>
          </div>
          <p className="footer-brand-desc">Hệ thống y tế tiên phong ứng dụng công nghệ hiện đại, chăm sóc sức khỏe toàn diện cho mọi gia đình Việt.</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-btn"><Globe size={15} /></a>
            <a href="#" className="footer-social-btn"><MessageCircle size={15} /></a>
            <a href="#" className="footer-social-btn"><Share2 size={15} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links-col">
          <h4>Dịch vụ y tế</h4>
          <ul>
            <li><a href="#">Khám tổng quát</a></li>
            <li><a href="#">Xét nghiệm chuyên sâu</a></li>
            <li><a href="#">Chẩn đoán hình ảnh</a></li>
            <li><a href="#">Tiêm chủng Vắc-xin</a></li>
            <li><a href="#">Cấp cứu 24/7</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Quy trình khám bệnh</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Hướng dẫn đặt lịch</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact-col">
          <h4>Liên hệ</h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <MapPin size={14} className="fc-icon" />
              <span>123 Đường Hậu Anh, Quận Cầu Giấy, Hà Nội</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={14} className="fc-icon" />
              <span>Hotline: 1900 6789</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} className="fc-icon" />
              <span>contact@hauanhhospital.vn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-divider">
        <div className="container footer-bottom-row">
          <p>© 2026 Hậu Anh Hospital. Bảo lưu mọi quyền.</p>
          <div className="footer-bottom-links">
            <a href="#">Chính sách bảo mật</a>
            <span></span>
            <a href="#">Điều khoản dịch vụ</a>
            <span></span>
            <a href="#">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
