import React from 'react';
import { TrendingUp, CreditCard, Building2, Layers } from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import type { AccountsSummaryData } from '../../api/accountsApi';

interface FinancialOverviewProps {
  summary: AccountsSummaryData | null;
}

const METHOD_COLORS: Record<string, string> = {
  Cash: '#10b981',
  UPI: '#0284c7',
  Card: '#8b5cf6',
  Cheque: '#f59e0b',
  Insurance: '#06b6d4',
  Online: '#3b82f6',
  NEFT: '#6366f1',
  Other: '#64748b'
};

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ summary }) => {
  if (!summary) return null;

  const { revenue_trends = [], payment_method_breakdown = [], department_billing_breakdown = [] } = summary;

  // Calculate maximum value for trend scaling
  const maxTrendVal = Math.max(
    ...revenue_trends.map(t => Math.max(t.billed || 0, t.collected || 0)),
    1000
  );

  return (
    <div className={styles.dashboardGrid}>
      {/* Revenue & Collection Trends */}
      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>
            <TrendingUp size={18} color="#0284c7" />
            Daily Revenue & Collection Trends
          </h4>
          <span className={styles.sectionSubtitle}>Billed vs Received</span>
        </div>

        {revenue_trends.length === 0 ? (
          <div className={styles.emptyState}>No transaction activity recorded for this period.</div>
        ) : (
          <div className={styles.trendChartContainer}>
            {revenue_trends.slice(-7).map((trend, idx) => {
              const billedPct = Math.min(100, Math.round((trend.billed / maxTrendVal) * 100));
              const collectedPct = Math.min(100, Math.round((trend.collected / maxTrendVal) * 100));
              return (
                <div key={idx} className={styles.trendBarGroup}>
                  <div className={styles.trendBarRow}>
                    <span className={styles.trendDateLabel}>{trend.date}</span>
                    <div className={styles.trendBarTrack} title={`Billed: ₹${trend.billed.toLocaleString('en-IN')}, Collected: ₹${trend.collected.toLocaleString('en-IN')}`}>
                      <div
                        className={styles.trendBarBilled}
                        style={{ width: `${billedPct}%`, minWidth: trend.billed > 0 ? '4px' : '0px' }}
                      />
                      <div
                        className={styles.trendBarCollected}
                        style={{ width: `${collectedPct}%`, minWidth: trend.collected > 0 ? '4px' : '0px' }}
                      />
                    </div>
                    <span className={styles.trendAmountLabel}>
                      ₹{(trend.billed + trend.collected).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#0284c7' }} />
                <span>Billed Revenue (Debited)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#10b981' }} />
                <span>Collections Received (Credited)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method Distribution */}
      <div className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>
            <CreditCard size={18} color="#10b981" />
            Payment Instrument Distribution
          </h4>
          <span className={styles.sectionSubtitle}>
            Total: ₹{summary.financial_totals.total_collected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {payment_method_breakdown.length === 0 ? (
          <div className={styles.emptyState}>No payments recorded in this period.</div>
        ) : (
          <div className={styles.paymentList}>
            {payment_method_breakdown.map((pm, idx) => {
              const color = METHOD_COLORS[pm.method] || '#64748b';
              return (
                <div key={idx} className={styles.paymentItem}>
                  <div className={styles.paymentItemHeader}>
                    <span className={styles.paymentMethodName}>
                      {pm.method} <span style={{ color: '#64748b', fontWeight: 500 }}>({pm.percent}%)</span>
                    </span>
                    <span className={styles.paymentAmount}>
                      ₹{pm.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={styles.paymentProgressTrack}>
                    <div
                      className={styles.paymentProgressBar}
                      style={{ width: `${pm.percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Department Billing Breakdown */}
        {department_billing_breakdown.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="#64748b" />
              Department Revenue Allocation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {department_billing_breakdown.map((dept, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>{dept.department}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    ₹{dept.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FinancialOverview;
