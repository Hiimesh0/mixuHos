import React from 'react';
import { BedDouble, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import type { AccountsSummaryData } from '../../api/accountsApi';

interface BedOccupancySectionProps {
  bedMetrics: AccountsSummaryData['bed_metrics'] | undefined;
}

export const BedOccupancySection: React.FC<BedOccupancySectionProps> = ({ bedMetrics }) => {
  if (!bedMetrics) return null;

  const {
    total_beds = 0,
    occupied_beds = 0,
    vacant_beds = 0,
    occupancy_rate_percent = 0,
    ward_breakdown = {}
  } = bedMetrics;

  const wards = Object.entries(ward_breakdown);

  return (
    <div className={styles.cardSection}>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BedDouble size={20} color="#0891b2" />
          <h4 className={styles.sectionTitle}>Inpatient Bed Occupancy & Ward Capacity</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
            Occupied: {occupied_beds}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Vacant: {vacant_beds}
          </span>
          <span style={{ color: '#64748b', fontWeight: 500 }}>
            Total Capacity: {total_beds} Beds ({occupancy_rate_percent}%)
          </span>
        </div>
      </div>

      <div className={styles.bedGrid}>
        {wards.length === 0 ? (
          <div className={styles.emptyState}>No ward or bed information available.</div>
        ) : (
          wards.map(([wardName, counts]) => {
            const wardOccPercent = counts.total > 0 ? Math.round((counts.occupied / counts.total) * 100) : 0;
            return (
              <div key={wardName} className={styles.bedCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.wardName}>{wardName}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: wardOccPercent > 75 ? '#fee2e2' : wardOccPercent > 0 ? '#e0f2fe' : '#f1f5f9',
                    color: wardOccPercent > 75 ? '#dc2626' : wardOccPercent > 0 ? '#0284c7' : '#64748b'
                  }}>
                    {wardOccPercent}% Full
                  </span>
                </div>

                <div className={styles.wardCounts}>
                  <span>Occupied: <strong className={styles.occupiedCount}>{counts.occupied}</strong></span>
                  <span>Vacant: <strong className={styles.vacantCount}>{counts.vacant}</strong></span>
                  <span>Total: <strong>{counts.total}</strong></span>
                </div>

                <div className={styles.wardProgressBar}>
                  <div
                    className={styles.wardProgressFill}
                    style={{
                      width: `${wardOccPercent}%`,
                      backgroundColor: wardOccPercent > 80 ? '#ef4444' : '#0284c7'
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default BedOccupancySection;
