
import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { doctorApi } from '../../utils/api';
import './DoctorSearch.css';

const DoctorSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    specialization: queryParams.get('specialization') || '',
    experienceMin: '',
    minRating: '',
    page: 0
  });
  const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0 });

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doctorApi.search({
        specialization: filters.specialization !== 'Tất cả' ? filters.specialization : '',
        experienceMin: filters.experienceMin,
        minRating: filters.minRating,
        page: filters.page
      });
      // response.data is ApiResponse object, response.data.data is the content list
      setDoctors(response.data.data || []);
      if (response.data.meta) {
        setPagination(response.data.meta);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      if (!err.response) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra API Gateway (Port 4004).');
      } else {
        // Fallback to all doctors if filtering fails but server is up
        try {
          const allRes = await doctorApi.getAll();
          setDoctors(allRes.data.data || allRes.data || []);
        } catch (innerErr) {
          setDoctors([]);
          setError('Đã xảy ra lỗi khi tải danh sách bác sĩ.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [location.search]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (newPage = 0) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    const params = new URLSearchParams();
    if (filters.specialization && filters.specialization !== 'Tất cả') params.append('specialization', filters.specialization);
    if (filters.experienceMin) params.append('experienceMin', filters.experienceMin);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (newPage > 0) params.append('page', newPage);
    navigate({ search: params.toString() });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container section-padding mt-10">
      <div className="search-container">
        <div className="search-sidebar glass">
          <h3>Bộ lọc tìm kiếm</h3>
          <div className="filter-group">
            <label>Chuyên khoa</label>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
            >
              <option>Tất cả</option>
              <option value="Internal Medicine">Nội khoa</option>
              <option value="Pediatrics">Nhi khoa</option>
              <option value="Cardiology">Tim mạch</option>
              <option value="Surgery">Ngoại khoa</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Kinh nghiệm</label>
            <select name="experienceMin" value={filters.experienceMin} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              <option value="5">Trên 5 năm</option>
              <option value="10">Trên 10 năm</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Đánh giá</label>
            <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              <option value="4">4+ Sao</option>
              <option value="5">5 Sao</option>
            </select>
          </div>
          <button className="btn-apply" onClick={applyFilters}>Áp dụng bộ lọc</button>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h2>
              {loading ? 'Đang tìm kiếm...' : error ? 'Lỗi kết nối' : `Tìm thấy ${doctors.length} bác sĩ phù hợp`}
            </h2>
            <div className="sort-box">
              <span>Sắp xếp:</span>
              <select><option>Phổ biến nhất</option><option>Giá thấp nhất</option></select>
            </div>
          </div>

          {error && (
            <div className="no-data-full" style={{ borderColor: 'var(--danger)', background: 'var(--danger-light)' }}>
              <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#991B1B', fontWeight: 700 }}>{error}</p>
              <button className="btn-secondary" onClick={fetchDoctors} style={{ marginTop: '1rem' }}>Thử lại</button>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={40} />
              <p>Đang tìm kiếm bác sĩ...</p>
            </div>
          ) : !error && (
            <div className="doctors-list">
              {doctors.length > 0 ? doctors.map((doc) => (
                <div key={doc.id} className="card result-doc-card" onClick={() => navigate(`/doctor/${doc.id}`)}>
                  <div className="doc-img-placeholder">
                    {doc.profileImage ? (
                      <img src={doc.profileImage} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      doc.name.split(' ').pop().charAt(0)
                    )}
                  </div>
                  <div className="doc-main-info">
                    <div className="flex-between">
                      <h3>{doc.name}</h3>
                      <div className="price">{doc.consultationFee ? `${doc.consultationFee.toLocaleString()}đ` : '500.000đ'}</div>
                    </div>
                    <p className="spec">{doc.specialization} • {doc.yearsOfExperience || 5} năm kinh nghiệm</p>
                    <div className="doc-meta-row">
                      <div className="meta-item"><Star size={14} className="fill-star" /> {doc.rating || 5.0} ({doc.reviewCount || 0}+)</div>
                      <div className="meta-item"><MapPin size={14} /> {doc.location || 'Hà Nội'}</div>
                      <div className="meta-item text-green"><Clock size={14} /> Có lịch: Hôm nay</div>
                    </div>
                    <div className="doc-actions">
                      <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/doctor/${doc.id}`); }}>Xem chi tiết</button>
                      <button className="btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/doctor/${doc.id}`); }}>Đặt lịch ngay</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-data-full">
                  <p>Không tìm thấy bác sĩ phù hợp với yêu cầu của bạn.</p>
                  <button className="btn-text" onClick={() => navigate('/doctors')}>Xóa bộ lọc</button>
                </div>
              )}
              
              {pagination.totalPages > 1 && (
                <div className="pagination-premium flex-center gap-4 mt-10">
                  <button 
                    className="p-btn" 
                    disabled={filters.page === 0}
                    onClick={() => applyFilters(filters.page - 1)}
                  >
                    Trước
                  </button>
                  <span className="p-info">Trang {filters.page + 1} / {pagination.totalPages}</span>
                  <button 
                    className="p-btn"
                    disabled={filters.page >= pagination.totalPages - 1}
                    onClick={() => applyFilters(filters.page + 1)}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorSearch;
