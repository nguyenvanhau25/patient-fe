import React, { useMemo, useState, useEffect } from 'react';
import {
  Search, Plus, Clipboard, Download, X, Loader2, Check,
  Calendar, Stethoscope, Eye, Sparkles, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicalApi, doctorApi, patientApi } from '../../utils/api';
import { useApi } from '../../hooks/useApi';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import './AdminUsers.css';
import './Clinical.css';

const spring = { type: 'spring', stiffness: 100 };
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: spring } };

const EMPTY_RECORD_FORM = {
  patientId: '', doctorId: '',
  visitDate: new Date().toISOString().split('T')[0],
  symptoms: '', diagnosis: '', notes: ''
};
const EMPTY_AI_FORM = { patientId: '', doctorId: '', chiefComplaint: '', currentSymptoms: '', notes: '' };
const EMPTY_AI_RESULT = {
  patientName: '', doctorName: '', specialty: '', clinicalSummary: '',
  suggestedDiagnosis: '', riskLevel: '', recommendedActions: [],
  redFlags: [], disclaimer: '', historicalRecordCount: 0, aiGenerated: false
};

const Field = ({ label, children }) => (
  <div className="form-group-p">
    <label>{label}</label>
    {children}
  </div>
);

const Clinical = () => {
  const { data: recordsRaw, loading, error, execute: fetchRecords } = useApi(() => clinicalApi.getAllRecords());
  const [modals, setModals] = useState({ record: false, ai: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiError, setAiError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(EMPTY_RECORD_FORM);
  const [aiForm, setAiForm] = useState(EMPTY_AI_FORM);
  const [aiResult, setAiResult] = useState(EMPTY_AI_RESULT);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    doctorApi.getAll().then(res => setDoctors(res?.data?.data || res?.data || [])).catch(console.error);
    patientApi.getAll().then(res => setPatients(res?.data?.data || res?.data || [])).catch(console.error);
  }, []);

  const records = recordsRaw?.data || [];
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const kw = searchTerm.toLowerCase();
    return records.filter(rec =>
      [rec.id, rec.medicalRecordId, rec.patientId, rec.patientName, rec.diagnosis, rec.doctorName]
        .filter(Boolean).some(v => v.toString().toLowerCase().includes(kw))
    );
  }, [records, searchTerm]);

  const openModal = (key) => setModals(p => ({ ...p, [key]: true }));
  const closeModal = (key) => setModals(p => ({ ...p, [key]: false }));

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await clinicalApi.createRecord(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        closeModal('record');
        fetchRecords();
        setFormData(EMPTY_RECORD_FORM);
      }, 1500);
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể tạo bệnh án'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAi = async (e) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiError('');
    try {
      const res = await clinicalApi.generateDiagnosisTemplate(aiForm);
      setAiResult(res?.data ?? res);
    } catch (err) {
      setAiError(err.response?.data?.message || 'Không thể tạo mẫu chẩn đoán AI');
      setAiResult(EMPTY_AI_RESULT);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyAiToRecord = () => {
    setFormData(prev => ({
      ...prev,
      patientId: aiForm.patientId,
      doctorId: aiForm.doctorId,
      symptoms: aiForm.currentSymptoms || aiForm.chiefComplaint,
      diagnosis: aiResult.suggestedDiagnosis || prev.diagnosis,
      notes: [aiResult.clinicalSummary, ...(aiResult.recommendedActions || [])].filter(Boolean).join('\n')
    }));
    closeModal('ai');
    openModal('record');
  };

  const riskClass = (lvl = '') => lvl.toLowerCase().replace(' ', '_');

  const quickActions = [
    { icon: <Clipboard />, title: 'Tra cứu', color: 'blue', desc: 'Mã BN hoặc ID hồ sơ', action: () => document.querySelector('.search-input')?.focus() },
    { icon: <Sparkles />, title: 'Mẫu AI', color: 'emerald', desc: 'Sinh mẫu chẩn đoán hỗ trợ bác sĩ', action: () => openModal('ai') },
    { icon: <Download />, title: 'Báo cáo', color: 'indigo', desc: 'Xuất dữ liệu lâm sàng', action: () => alert('Chức năng đang hoàn thiện.') },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-page-container">
      <header className="page-header flex-between mb-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-gradient">Bệnh án điện tử</h1>
          <p className="text-muted">Quản lý chẩn đoán lâm sàng và tạo mẫu hỗ trợ bác sĩ bằng AI.</p>
        </motion.div>
        <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="btn btn-primary" onClick={() => openModal('record')}>
          <Plus size={18} /> <span>Tạo bệnh án mới</span>
        </motion.button>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-10">
        {quickActions.map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}
            className={`card glass quick-action-p ${item.color}`}
            onClick={item.action} whileHover={{ y: -5, cursor: 'pointer' }}>
            <div className="action-icon-p">{item.icon}</div>
            <div className="action-text-p"><h4>{item.title}</h4><p>{item.desc}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Add Record Modal */}
      <AnimatePresence>
        {modals.record && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} className="modal-premium modal-wide glass">
              <div className="modal-header-p">
                <h3>Khởi tạo Bệnh án</h3>
                <button className="close-btn" onClick={() => closeModal('record')}><X size={20} /></button>
              </div>
              <div className="modal-body-p">
                {showSuccess ? (
                  <div className="success-state-modal">
                    <div className="success-icon-box"><Check size={40} /></div>
                    <h4>Thành công!</h4><p>Bệnh án đã được lưu trữ.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAddRecord} className="premium-form">
                    <Field label="Bệnh nhân">
                      <select required
                        value={formData.patientId} onChange={e => setFormData(p => ({ ...p, patientId: e.target.value }))}>
                        <option value="" disabled>-- Chọn Bệnh nhân --</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.fullName || p.name} ({p.email || p.phone})</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Triệu chứng">
                      <input required placeholder="Đau đầu, sốt..."
                        value={formData.symptoms} onChange={e => setFormData(p => ({ ...p, symptoms: e.target.value }))} />
                    </Field>
                    <Field label="Chẩn đoán">
                      <textarea required rows={3} placeholder="Mô tả chẩn đoán chuyên sâu..."
                        value={formData.diagnosis} onChange={e => setFormData(p => ({ ...p, diagnosis: e.target.value }))} />
                    </Field>
                    <div className="form-row-p">
                      <Field label="Bác sĩ điều trị">
                        <select required
                          value={formData.doctorId} onChange={e => setFormData(p => ({ ...p, doctorId: e.target.value }))}>
                          <option value="" disabled>-- Chọn Bác sĩ --</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Ngày khám">
                        <input required type="date"
                          value={formData.visitDate} onChange={e => setFormData(p => ({ ...p, visitDate: e.target.value }))} />
                      </Field>
                    </div>
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel" onClick={() => closeModal('record')}>Hủy</button>
                      <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Lưu Bệnh án'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Modal */}
      <AnimatePresence>
        {modals.ai && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} className="modal-premium modal-wide glass">
              <div className="modal-header-p">
                <h3>Mẫu chẩn đoán hỗ trợ AI</h3>
                <button className="close-btn" onClick={() => { closeModal('ai'); setAiForm(EMPTY_AI_FORM); setAiResult(EMPTY_AI_RESULT); setAiError(''); }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body-p">
                <div className="ai-modal-grid">
                  {/* Left: form */}
                  <form onSubmit={handleGenerateAi} className="ai-form-panel premium-form">
                    <div className="form-row-p">
                      <Field label="Bệnh nhân">
                        <select required
                          value={aiForm.patientId} onChange={e => setAiForm(p => ({ ...p, patientId: e.target.value }))}>
                          <option value="" disabled>-- Bệnh nhân --</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.fullName || p.name}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Bác sĩ">
                        <select required
                          value={aiForm.doctorId} onChange={e => setAiForm(p => ({ ...p, doctorId: e.target.value }))}>
                          <option value="" disabled>-- Bác sĩ --</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field label="Lý do khám">
                      <input required placeholder="Sốt cao, đau ngực, khó thở..."
                        value={aiForm.chiefComplaint} onChange={e => setAiForm(p => ({ ...p, chiefComplaint: e.target.value }))} />
                    </Field>
                    <Field label="Triệu chứng hiện tại">
                      <textarea rows={3} placeholder="Mô tả triệu chứng, thời gian khởi phát..."
                        value={aiForm.currentSymptoms} onChange={e => setAiForm(p => ({ ...p, currentSymptoms: e.target.value }))} />
                    </Field>
                    <Field label="Ghi chú lâm sàng">
                      <textarea rows={4} placeholder="Khám thực thể, dấu hiệu sinh tồn..."
                        value={aiForm.notes} onChange={e => setAiForm(p => ({ ...p, notes: e.target.value }))} />
                    </Field>
                    {aiError && <div className="ai-disclaimer ai-error-box">{aiError}</div>}
                    <div className="modal-actions-p mt-4">
                      <button type="button" className="btn-cancel"
                        onClick={() => { setAiForm(EMPTY_AI_FORM); setAiResult(EMPTY_AI_RESULT); setAiError(''); }}>
                        Làm mới
                      </button>
                      <button type="submit" className="btn-submit" disabled={isGeneratingAi}>
                        {isGeneratingAi ? <Loader2 className="animate-spin" size={18} /> : 'Tạo mẫu AI'}
                      </button>
                    </div>
                  </form>

                  {/* Right: result */}
                  <div className="ai-result-panel">
                    <div className="ai-status-row">
                      <h4>Kết quả hỗ trợ</h4>
                      {aiResult.riskLevel && (
                        <span className={`risk-badge-ai ${riskClass(aiResult.riskLevel)}`}>
                          <AlertTriangle size={14} /> {aiResult.riskLevel}
                        </span>
                      )}
                    </div>

                    {isGeneratingAi ? (
                      <LoadingState message="AI đang phân tích dữ liệu..." />
                    ) : aiResult.suggestedDiagnosis ? (
                      <>
                        <div className="ai-meta">
                          {[
                            ['Bệnh nhân', aiResult.patientName || aiForm.patientId],
                            ['Bác sĩ', aiResult.doctorName || aiForm.doctorId],
                            ['Chuyên khoa', aiResult.specialty || 'Chưa có'],
                            ['Hồ sơ cũ', `${aiResult.historicalRecordCount || 0} lần khám`],
                          ].map(([lbl, val]) => (
                            <div key={lbl} className="ai-meta-item">
                              <span>{lbl}</span><strong>{val}</strong>
                            </div>
                          ))}
                        </div>
                        {[
                          ['Tóm tắt lâm sàng', <p>{aiResult.clinicalSummary}</p>],
                          ['Chẩn đoán gợi ý', <p>{aiResult.suggestedDiagnosis}</p>],
                          ['Khuyến nghị', <ul className="ai-list">{(aiResult.recommendedActions || []).map((a, i) => <li key={i}>{a}</li>)}</ul>],
                          ['Dấu hiệu cần lưu ý', <ul className="ai-list danger">{(aiResult.redFlags || []).map((f, i) => <li key={i}>{f}</li>)}</ul>],
                        ].map(([title, content]) => (
                          <div key={title} className="ai-panel" style={{ marginBottom: '0.75rem' }}>
                            <h4>{title}</h4>{content}
                          </div>
                        ))}
                        <div className="ai-disclaimer">{aiResult.disclaimer}</div>
                        <button type="button" className="btn btn-primary ai-action-button mt-4" onClick={applyAiToRecord}>
                          <Stethoscope size={18} /> <span>Đưa vào form bệnh án</span>
                        </button>
                      </>
                    ) : (
                      <EmptyState title="Chưa có kết quả" message="Nhập dữ liệu lâm sàng và bấm tạo mẫu AI." />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={itemVariants} className="card glass">
        <div className="table-filters flex-between p-6">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm bệnh án..." className="search-input"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="table-content">
          {loading ? <LoadingState message="Đang tải..." />
            : error ? <EmptyState isError title="Lỗi" />
              : filteredRecords.length === 0 ? <EmptyState title="Trống" message="Chưa có bệnh án được tạo." />
                : (
                  <div className="table-responsive">
                    <table className="modern-table">
                      <thead>
                        <tr><th>Mã số</th><th>Bệnh nhân</th><th>Ngày khám</th><th>Chẩn đoán</th><th>Bác sĩ</th><th className="text-right">Hành động</th></tr>
                      </thead>
                      <tbody>
                        <AnimatePresence mode="popLayout">
                          {filteredRecords.map(rec => rec && (
                            <motion.tr key={rec.id || rec.medicalRecordId} variants={itemVariants} className="table-row">
                              <td><span className="badge-role role-admin">{(rec.id || rec.medicalRecordId || 'N/A').toString().substring(0, 8)}</span></td>
                              <td><span className="font-bold">{rec.patientName || rec.patientId || 'Bệnh nhân ẩn'}</span></td>
                              <td><div className="contact-item"><Calendar size={14} /> {rec.appointmentDate || rec.visitDate || 'N/A'}</div></td>
                              <td><div className="badge-role role-doctor">{rec.diagnosis || 'Chưa chẩn đoán'}</div></td>
                              <td>{rec.doctorName || rec.doctorId || 'BS. Trực'}</td>
                              <td className="text-right"><button className="btn-icon-p info" title="Xem hồ sơ"><Eye size={16} /></button></td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Clinical;