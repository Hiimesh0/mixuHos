import React, { useState } from 'react';
import { 
  Activity, 
  Bed, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Search,
  Plus
} from 'lucide-react';
import styles from './DashboardPreview.module.css';
import { HOSPITAL_APP_URL } from '../config';

export const DashboardPreview: React.FC = () => {
  const [selectedWard, setSelectedWard] = useState<'all' | 'icu' | 'deluxe' | 'general'>('all');

  const beds = [
    { no: 'ICU-01', ward: 'icu', wardName: 'ICU', patient: 'TestBillPatient', uhid: 'UHID-1023', status: 'Occupied' },
    { no: 'ICU-02', ward: 'icu', wardName: 'ICU', patient: 'Sunita Joshi', uhid: 'UHID-1008', status: 'Occupied' },
    { no: 'ICU-03', ward: 'icu', wardName: 'ICU', patient: null, uhid: null, status: 'Vacant' },
    { no: 'DLX-201', ward: 'deluxe', wardName: 'Deluxe AC', patient: 'Ramesh Patel', uhid: 'UHID-1022', status: 'Occupied' },
    { no: 'DLX-202', ward: 'deluxe', wardName: 'Deluxe AC', patient: null, uhid: null, status: 'Vacant' },
    { no: 'DLX-203', ward: 'deluxe', wardName: 'Deluxe AC', patient: null, uhid: null, status: 'Cleaning' },
    { no: 'GEN-101', ward: 'general', wardName: 'General Male', patient: 'Nikhil Roy', uhid: 'UHID-1019', status: 'Occupied' },
    { no: 'GEN-102', ward: 'general', wardName: 'General Male', patient: 'Sanjay Saxena', uhid: 'UHID-1017', status: 'Occupied' },
    { no: 'GEN-103', ward: 'general', wardName: 'General Male', patient: null, uhid: null, status: 'Vacant' },
  ];

  const filteredBeds = selectedWard === 'all' ? beds : beds.filter(b => b.ward === selectedWard);

  return (
    <section id="preview" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} /> Interactive UI Experience
          </span>
          <h2 className="section-title">
            Hospital Operations Control Center at a Glance
          </h2>
          <p className="section-subtitle">
            Experience the clean, clutter-free workspace where hospital staff manage admissions, monitor ward occupancy, and access clinical histories in real time.
          </p>
        </div>

        {/* Dashboard Shell */}
        <div className={styles.mockupShell}>
          {/* Mockup Titlebar */}
          <div className={styles.mockupTitlebar}>
            <div className={styles.windowControls}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <div className={styles.urlBar}>
              <Activity size={13} color="#0D9488" />
              <span>mixuhos.hospital/app/#/indoor-register</span>
            </div>
            <a
              href={HOSPITAL_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openLiveBadge}
            >
              <span>Open Live App</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Mockup Content Area */}
          <div className={styles.mockupContent}>
            {/* Top Stat Gauges */}
            <div className={styles.gaugeGrid}>
              <div className={styles.gaugeCard}>
                <div className={styles.gaugeIcon} style={{ background: 'rgba(13, 148, 136, 0.15)', color: '#14b8a6' }}>
                  <Users size={18} />
                </div>
                <div className={styles.gaugeInfo}>
                  <span className={styles.gaugeVal}>58</span>
                  <span className={styles.gaugeLabel}>Registered Patients</span>
                </div>
              </div>

              <div className={styles.gaugeCard}>
                <div className={styles.gaugeIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                  <Bed size={18} />
                </div>
                <div className={styles.gaugeInfo}>
                  <span className={styles.gaugeVal}>8 / 24</span>
                  <span className={styles.gaugeLabel}>Beds Occupied (33%)</span>
                </div>
              </div>

              <div className={styles.gaugeCard}>
                <div className={styles.gaugeIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  <TrendingUp size={18} />
                </div>
                <div className={styles.gaugeInfo}>
                  <span className={styles.gaugeVal}>₹ 2,48,750</span>
                  <span className={styles.gaugeLabel}>Billed This Month</span>
                </div>
              </div>

              <div className={styles.gaugeCard}>
                <div className={styles.gaugeIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  <Clock size={18} />
                </div>
                <div className={styles.gaugeInfo}>
                  <span className={styles.gaugeVal}>22 Rounds</span>
                  <span className={styles.gaugeLabel}>Dr Visits Logged</span>
                </div>
              </div>
            </div>

            {/* Live Ward Matrix Simulation */}
            <div className={styles.matrixSection}>
              <div className={styles.matrixHeader}>
                <div className={styles.matrixTitle}>
                  <Bed size={18} color="#0D9488" />
                  <h4>Live Inpatient Ward Matrix</h4>
                </div>
                <div className={styles.wardFilterRow}>
                  <button
                    type="button"
                    className={`${styles.wardFilterBtn} ${selectedWard === 'all' ? styles.wardActive : ''}`}
                    onClick={() => setSelectedWard('all')}
                  >
                    All Wards
                  </button>
                  <button
                    type="button"
                    className={`${styles.wardFilterBtn} ${selectedWard === 'icu' ? styles.wardActive : ''}`}
                    onClick={() => setSelectedWard('icu')}
                  >
                    ICU
                  </button>
                  <button
                    type="button"
                    className={`${styles.wardFilterBtn} ${selectedWard === 'deluxe' ? styles.wardActive : ''}`}
                    onClick={() => setSelectedWard('deluxe')}
                  >
                    Deluxe AC
                  </button>
                  <button
                    type="button"
                    className={`${styles.wardFilterBtn} ${selectedWard === 'general' ? styles.wardActive : ''}`}
                    onClick={() => setSelectedWard('general')}
                  >
                    General Ward
                  </button>
                </div>
              </div>

              <div className={styles.bedGrid}>
                {filteredBeds.map(b => (
                  <div
                    key={b.no}
                    className={`${styles.bedCard} ${b.status === 'Occupied' ? styles.bedOccupied : b.status === 'Vacant' ? styles.bedVacant : styles.bedCleaning}`}
                  >
                    <div className={styles.bedTop}>
                      <span className={styles.bedNumber}>{b.no}</span>
                      <span className={styles.bedStatusBadge}>{b.status}</span>
                    </div>
                    {b.patient ? (
                      <div className={styles.bedPatient}>
                        <span className={styles.patientName}>{b.patient}</span>
                        <span className={styles.patientUhid}>{b.uhid}</span>
                      </div>
                    ) : (
                      <div className={styles.bedEmpty}>
                        <span>Ready for Admission</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Live Banner */}
          <div className={styles.mockupFooter}>
            <span>Experience this actual production interface with preloaded hospital test data:</span>
            <a
              href={HOSPITAL_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fullDemoBtn}
            >
              <span>Launch Live System</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
