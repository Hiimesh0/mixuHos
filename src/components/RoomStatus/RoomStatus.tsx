import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, CheckCircle2, BedDouble } from 'lucide-react';
import styles from './RoomStatus.module.css';
import { bedApi, admissionApi, type BedRecord, type AdmissionRecord } from '../../api/hospitalApi';

const RoomStatus: React.FC = () => {
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Occupied' | 'Vacant'>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  const loadBedsAndAdmissions = useCallback(async () => {
    try {
      setLoading(true);
      const [allBeds, allAdmissions] = await Promise.all([
        bedApi.getBeds(),
        admissionApi.getAdmissions({ status: 'Admitted' }),
      ]);
      setBeds(allBeds);
      setAdmissions(allAdmissions);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBedsAndAdmissions();
  }, [loadBedsAndAdmissions]);

  // Extract unique wards
  const wards = useMemo(() => {
    const map = new Map<string, { total: number; occupied: number }>();
    beds.forEach(b => {
      const ward = b.ward_name || 'General Ward';
      const curr = map.get(ward) || { total: 0, occupied: 0 };
      curr.total += 1;
      if (b.status === 'Occupied') curr.occupied += 1;
      map.set(ward, curr);
    });

    const list = Array.from(map.entries()).map(([name, counts]) => ({
      id: name,
      label: name,
      total: counts.total,
      occupied: counts.occupied,
    }));

    return [{ id: 'ALL', label: 'All Wards', total: beds.length, occupied: beds.filter(b => b.status === 'Occupied').length }, ...list];
  }, [beds]);

  const filteredBeds = useMemo(() => {
    return beds.filter(b => {
      if (activeTab !== 'ALL' && b.ward_name !== activeTab) return false;
      if (statusFilter === 'Occupied' && b.status !== 'Occupied') return false;
      if (statusFilter === 'Vacant' && b.status !== 'Vacant') return false;
      return true;
    });
  }, [beds, activeTab, statusFilter]);

  const summary = useMemo(() => {
    const total = beds.length;
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    const unoccupied = total - occupied;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, unoccupied, occupancyRate };
  }, [beds]);

  const getAdmissionForBed = (bedNum: string): AdmissionRecord | undefined => {
    return admissions.find(a => a.bed_number === bedNum && a.status === 'Admitted');
  };

  const handleBedClick = async (bed: BedRecord) => {
    const adm = getAdmissionForBed(bed.bed_number);
    if (adm) {
      alert(`Bed ${bed.bed_number} (${bed.ward_name})\nPatient: ${adm.patient_name} (${adm.uhid})\nIPD: ${adm.ipd_no}\nAdmitted: ${adm.admission_date}\nDoctor: ${adm.admitting_doctor}`);
    } else {
      const confirmOccupy = window.confirm(`Bed ${bed.bed_number} is currently Vacant. Would you like to mark it for Maintenance/Cleaning?`);
      if (confirmOccupy) {
        await bedApi.updateBed(bed.id, { status: bed.status === 'Vacant' ? 'Maintenance' : 'Vacant' });
        loadBedsAndAdmissions();
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BedDouble size={24} style={{ color: '#2563eb' }} />
          <h1 className={styles.pageTitle} style={{ margin: 0, textAlign: 'left' }}>Real-time Room & Bed Status Layout</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={styles.tab}
            onClick={loadBedsAndAdmissions}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spin : ''} /> {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {wards.map(tab => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.tabBadge}>{tab.occupied}/{tab.total}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '4px 0 12px 0' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Status Filter:</span>
        <button
          onClick={() => setStatusFilter('ALL')}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            backgroundColor: statusFilter === 'ALL' ? '#2563eb' : '#fff',
            color: statusFilter === 'ALL' ? '#fff' : '#334155',
            cursor: 'pointer',
          }}
        >
          All Beds ({summary.total})
        </button>
        <button
          onClick={() => setStatusFilter('Occupied')}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            backgroundColor: statusFilter === 'Occupied' ? '#dc2626' : '#fff',
            color: statusFilter === 'Occupied' ? '#fff' : '#334155',
            cursor: 'pointer',
          }}
        >
          Occupied ({summary.occupied})
        </button>
        <button
          onClick={() => setStatusFilter('Vacant')}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            backgroundColor: statusFilter === 'Vacant' ? '#16a34a' : '#fff',
            color: statusFilter === 'Vacant' ? '#fff' : '#334155',
            cursor: 'pointer',
          }}
        >
          Vacant ({summary.unoccupied})
        </button>
      </div>

      {/* Room Grid */}
      <div className={styles.roomGrid}>
        {filteredBeds.map(bed => {
          const adm = getAdmissionForBed(bed.bed_number);
          if (bed.status === 'Occupied' && adm) {
            return (
              <div
                key={bed.id}
                className={styles.roomCard}
                onClick={() => handleBedClick(bed)}
                style={{ cursor: 'pointer', borderLeft: '4px solid #dc2626' }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardDate}>
                    {adm.admission_date}
                    <div className={styles.badgeGroup}>
                      <span className={styles.statusBadge} style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Occupied</span>
                      {adm.insurance_company && <span className={styles.statusBadge}>CL</span>}
                    </div>
                  </div>
                  <span className={styles.roomId}>Bed {bed.bed_number}</span>
                  <span className={styles.recordId}>{adm.ipd_no}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.patientName}>{adm.patient_name}</h3>
                  <span className={styles.patientAddress}>{bed.ward_name} ({adm.uhid})</span>
                  <span className={styles.doctorName}>{adm.admitting_doctor}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={bed.id}
              className={styles.roomCardEmpty}
              onClick={() => handleBedClick(bed)}
              style={{ cursor: 'pointer', borderLeft: '4px solid #16a34a' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
                <span className={styles.emptyRoomId} style={{ fontWeight: 700 }}>Bed {bed.bed_number}</span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Vacant</span>
              </div>
              <span className={styles.emptyText}>{bed.ward_name}</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Rs. {bed.daily_rate}/day</span>
            </div>
          );
        })}

        {/* Summary Stats Card */}
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total Beds</span>
            <span>{summary.total}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.occupied}`}>
            <span>Occupied</span>
            <span>{summary.occupied}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.unoccupied}`}>
            <span>Unoccupied</span>
            <span>{summary.unoccupied}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.booked}`}>
            <span>Occupancy Rate</span>
            <span>{summary.occupancyRate}%</span>
          </div>
        </div>
      </div>

      {/* Footer / Legend */}
      <div className={styles.footerSection}>
        <div className={styles.legendBar}>
          <div className={styles.legendItem}><span className={styles.legendBadge} style={{ backgroundColor: '#dc2626', color: '#fff' }}>Red</span> Occupied</div>
          <div className={styles.legendItem}><span className={styles.legendBadge} style={{ backgroundColor: '#16a34a', color: '#fff' }}>Green</span> Vacant / Available</div>
          <div className={styles.legendItem}><span className={styles.legendBadge}>CL</span> Cashless / TPA</div>
          <div className={styles.legendItem}><CheckCircle2 size={14} style={{ color: '#16a34a', verticalAlign: 'middle' }} /> Real-time sync with JSON Admissions</div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatus;
