import React, { useEffect, useState } from 'react';
import { Activity, Download, Pill, Loader2, ClipboardList, AlertCircle, Droplets, Thermometer, Wind, History, FileSpreadsheet, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicalApi, pharmacyApi, patientApi } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import './Health.css';

const Health = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('records');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const patientId = user?.userId;
    if (!patientId) {
      setRecords([]);
      setPrescriptions([]);
      setPatientData(null);
      setLoading(false);
      return;
    }

    try {
      const [recRes, prescRes, patientRes] = await Promise.allSettled([
        clinicalApi.getPatientRecords(patientId),
        pharmacyApi.getPatientPrescriptions(patientId),
        patientApi.getProfile(patientId)
      ]);

      setRecords(
        recRes.status === 'fulfilled'
          ? (Array.isArray(recRes.value.data) ? recRes.value.data : (recRes.value.data?.data || []))
          : []
      );
      setPrescriptions(
        prescRes.status === 'fulfilled'
          ? (Array.isArray(prescRes.value.data) ? prescRes.value.data : (prescRes.value.data?.data || []))
          : []
      );
      setPatientData(
        patientRes.status === 'fulfilled'
          ? (patientRes.value.data?.data || patientRes.value.data)
          : null
      );

      if (recRes.status === 'rejected' && prescRes.status === 'rejected' && patientRes.status === 'rejected') {
        throw recRes.reason || prescRes.reason || patientRes.reason;
      }
    } catch (err) {
      console.error('Failed to fetch health data:', err);
      setError('Khong the tai ho so suc khoe luc nay.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDownloadPdf = async () => {
    if (!user?.userId) {
      alert('Vui long dang nhap de xuat PDF.');
      return;
    }

    try {
      const response = await patientApi.exportPdf(user.userId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'HealthRecord.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Loi tai PDF.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="health-portal-premium">
      <div className="container py-8">
        <header className="page-header-premium mb-10 flex-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Ho so kham</h1>
            <p className="text-muted mt-2">Du lieu benh ly va don thuoc cua ban.</p>
          </div>
          <button className="btn-portal-primary btn-icon-text" onClick={handleDownloadPdf}>
            <Download size={18} /> Xuat PDF
          </button>
        </header>

        {error && (
          <div className="error-card glass p-10 flex-center flex-col text-center">
            <AlertCircle size={50} className="text-danger mb-4" />
            <p className="font-bold text-primary mb-2">Loi du lieu</p>
            <p className="text-muted mb-6">{error}</p>
            <button className="btn-portal-primary" onClick={fetchData}>Thu lai</button>
          </div>
        )}

        {!error && !user?.userId && !loading && (
          <div className="error-card glass p-10 flex-center flex-col text-center">
            <AlertCircle size={50} className="text-danger mb-4" />
            <p className="font-bold text-primary mb-2">Chua dang nhap</p>
            <p className="text-muted mb-6">Hay dang nhap de xem ho so suc khoe cua ban.</p>
          </div>
        )}

        {!error && user?.userId && (
          <>
            <div className="vitals-dashboard grid-cols-4 mb-10">
              <div className="vital-stat-card blue">
                <div className="v-icon-wrap"><Activity size={20} /></div>
                <div className="v-data">
                  <span className="v-label">Nhip tim</span>
                  <span className="v-value">{patientData?.vitals?.hr || '72'} <small>bpm</small></span>
                </div>
              </div>
              <div className="vital-stat-card red">
                <div className="v-icon-wrap"><Droplets size={20} /></div>
                <div className="v-data">
                  <span className="v-label">Huyet ap</span>
                  <span className="v-value">{patientData?.vitals?.bp || '120/80'} <small>mmHg</small></span>
                </div>
              </div>
              <div className="vital-stat-card orange">
                <div className="v-icon-wrap"><Thermometer size={20} /></div>
                <div className="v-data">
                  <span className="v-label">Nhiet do</span>
                  <span className="v-value">{patientData?.vitals?.temp || '36.5'} <small>C</small></span>
                </div>
              </div>
              <div className="vital-stat-card green">
                <div className="v-icon-wrap"><Wind size={20} /></div>
                <div className="v-data">
                  <span className="v-label">SpO2</span>
                  <span className="v-value">{patientData?.vitals?.spo2 || '98'} <small>%</small></span>
                </div>
              </div>
            </div>

            <div className="health-tabs-premium mb-8">
              <button
                className={`ph-tab ${activeTab === 'records' ? 'active' : ''}`}
                onClick={() => setActiveTab('records')}
              >
                <ClipboardList size={18} /> Lich su benh
              </button>
              <button
                className={`ph-tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('prescriptions')}
              >
                <Pill size={18} /> Don thuoc
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex-center flex-col">
                  <Loader2 className="animate-spin text-info mb-4" size={40} />
                  <p className="font-bold text-muted">Dang tai...</p>
                </motion.div>
              ) : activeTab === 'records' ? (
                <motion.div
                  key="records"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="records-content-list"
                >
                  {records.length > 0 ? records.map((rec) => (
                    <motion.div key={rec.medicalRecordId} variants={itemVariants} className="health-record-p-card">
                      <div className="record-date-sidebar">
                        <div className="d-icon"><Calendar size={16} /></div>
                        <span className="d-text">{new Date(rec.appointmentDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="record-main-info">
                        <div className="record-header-row">
                          <h3 className="record-title">{rec.chiefComplaint}</h3>
                          <span className="dr-tag">BS. {rec.doctorName || 'Bac si'}</span>
                        </div>
                        <div className="record-diagnosis">
                          <div className="label">Chan doan:</div>
                          <div className="value">{rec.diagnosis || 'Chua co ket qua'}</div>
                        </div>
                      </div>
                      <button className="btn-view-results" onClick={handleDownloadPdf}>
                        <FileSpreadsheet size={18} /> Ket qua
                      </button>
                    </motion.div>
                  )) : (
                    <div className="empty-health-state">
                      <History size={60} />
                      <p>Chua co du lieu.</p>
                      <button className="btn-portal-primary mt-4" onClick={fetchData}>Cap nhat</button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="prescriptions"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="prescriptions-content-list"
                >
                  {prescriptions.length > 0 ? prescriptions.map((presc) => (
                    <motion.div key={presc.prescriptionId} variants={itemVariants} className="prescription-p-card">
                      <div className="presc-p-header">
                        <div className="p-icon-box"><Pill size={24} /></div>
                        <div className="p-header-main">
                          <h3 className="p-title">Don thuoc #{presc.prescriptionId?.slice(-4) || '0000'}</h3>
                          <span className="p-meta">Ngay ke: {new Date(presc.dateIssued).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="p-status-tag">Dang dung</div>
                      </div>
                      <div className="presc-p-medicines">
                        {presc.medicines?.map((med, i) => (
                          <div key={i} className="medicine-row">
                            <div className="med-info">
                              <span className="med-name">{med.name}</span>
                              <span className="med-dosage">{med.dosage}</span>
                            </div>
                            <div className="med-usage">{med.frequency}</div>
                          </div>
                        ))}
                      </div>
                      <div className="presc-p-footer">
                        <p className="advice">Uong sau an.</p>
                        <button className="btn-p-order">Mua thuoc</button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="empty-health-state">
                      <Pill size={60} />
                      <p>Chua co don thuoc.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Health;
