import React, { useState, useEffect } from 'react';
import { CalendarCheck2, CheckCircle2, XCircle, Search, Filter, ShieldAlert, Lock, Clock, Building, User, Mail, Phone } from 'lucide-react';
import { authApi, type DemoRequestRecord } from '../../api/authApi';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';
import styles from './DemoRequestAdmin.module.css';

export const DemoRequestAdmin: React.FC = () => {
  const [requests, setRequests] = useState<DemoRequestRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Approval / Action modal
  const [selectedRequest, setSelectedRequest] = useState<DemoRequestRecord | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [durationDays, setDurationDays] = useState(14);
  const [internalNotes, setInternalNotes] = useState('');
  const [actionResult, setActionResult] = useState<any | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const list = await authApi.getDemoRequests();
      setRequests(list);
    } catch {
      setNotification({ type: 'error', message: 'Failed to fetch demo enquiries.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionModal = (req: DemoRequestRecord, type: 'approve' | 'reject') => {
    setSelectedRequest(req);
    setActionType(type);
    setInternalNotes('');
    setDurationDays(14);
    setActionResult(null);
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !actionType) return;

    try {
      if (actionType === 'approve') {
        const res = await authApi.approveDemoRequest(selectedRequest.id, durationDays, internalNotes);
        setActionResult(res);
        setNotification({ type: 'success', message: `Demo request for ${selectedRequest.hospital_name} approved successfully.` });
      } else {
        await authApi.rejectDemoRequest(selectedRequest.id, internalNotes);
        setSelectedRequest(null);
        setActionType(null);
        setNotification({ type: 'success', message: `Demo request marked as rejected.` });
      }
      await loadRequests();
      setTimeout(() => setNotification(null), 4000);
    } catch {
      setNotification({ type: 'error', message: 'Operation failed. Please try again.' });
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.enquiry_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.tagWrap}>
            <CalendarCheck2 size={16} color="#0284c7" />
            <span className={styles.tag}>Lead &amp; Sandbox Provisioning</span>
          </div>
          <h1 className={styles.title}>Book a Demo &amp; Administrator Approval Workflow</h1>
          <p className={styles.subtitle}>
            Review institutional walkthrough enquiries submitted from the public marketing website, assign trial durations, and provision isolated demo accounts.
          </p>
        </div>
      </div>

      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchBox}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by hospital, contact, or enquiry ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.statusPills}>
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(st => (
            <button
              key={st}
              type="button"
              className={`${styles.statusPill} ${statusFilter === st ? styles.statusPillActive : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st} {st !== 'All' ? `(${requests.filter(r => r.status === st).length})` : `(${requests.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid / Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Enquiry ID &amp; Date</th>
              <th>Hospital / Facility</th>
              <th>Contact Representative</th>
              <th>Scale &amp; Type</th>
              <th>Preferred Date</th>
              <th>Status</th>
              <th>Provisioned User</th>
              <th style={{ textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No demo requests found matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map(req => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0284c7' }}>{req.enquiry_id || req.id}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {new Date(req.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{req.hospital_name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{req.hospital_type}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{req.contact_person}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{req.email} • {req.phone}</div>
                  </td>
                  <td>
                    <span className={styles.bedBadge}>{req.bed_count}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {req.preferred_date || 'Flexible'}
                    </div>
                  </td>
                  <td>
                    <span className={
                      req.status === 'Approved' ? styles.badgeApproved :
                      req.status === 'Rejected' ? styles.badgeRejected : styles.badgePending
                    }>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.provisioned_user ? (
                      <code style={{ fontSize: '11.5px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {req.provisioned_user}
                      </code>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>None</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className={styles.btnApprove}
                          onClick={() => handleOpenActionModal(req, 'approve')}
                        >
                          Approve &amp; Provision
                        </button>
                        <button
                          type="button"
                          className={styles.btnReject}
                          onClick={() => handleOpenActionModal(req, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {req.status === 'Approved' ? `Approved on ${req.approved_at ? new Date(req.approved_at).toLocaleDateString() : 'N/A'}` : 'Declined'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onPrint={() => window.print()}
        printLabel="Print Enquiries Log"
        statusMessage={`Total Demo Enquiries: ${requests.length} • Pending Approval: ${requests.filter(r => r.status === 'Pending').length}`}
      />

      {/* Action Approval / Rejection Modal */}
      {selectedRequest && actionType && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRequest(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>
              {actionType === 'approve' ? 'Approve & Provision Demo Sandbox' : 'Reject Demo Request'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Facility: <strong>{selectedRequest.hospital_name}</strong> ({selectedRequest.contact_person})
            </p>

            {actionResult ? (
              <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>Sandbox User Provisioned!</span>
                </div>
                <div style={{ fontSize: '13px', color: '#15803d', lineHeight: 1.6 }}>
                  <div><strong>Username:</strong> {actionResult.demo_credentials?.username}</div>
                  <div><strong>Temporary Password:</strong> {actionResult.demo_credentials?.temporary_password}</div>
                  <div><strong>Access Expiry:</strong> {new Date(actionResult.demo_credentials?.expires_at).toLocaleDateString()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedRequest(null); setActionType(null); }}
                  style={{ marginTop: '12px', padding: '6px 16px', background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecuteAction}>
                {actionType === 'approve' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      Trial Access Duration (Days) *
                    </label>
                    <select
                      value={durationDays}
                      onChange={e => setDurationDays(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    >
                      <option value={7}>7 Days Trial</option>
                      <option value={14}>14 Days Standard Walkthrough</option>
                      <option value={30}>30 Days Institutional Evaluation</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Internal Administrative Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add approval notes or reason for rejection..."
                    value={internalNotes}
                    onChange={e => setInternalNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedRequest(null); setActionType(null); }}
                    style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      background: actionType === 'approve' ? '#0284c7' : '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {actionType === 'approve' ? 'Confirm & Create Sandbox' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoRequestAdmin;
