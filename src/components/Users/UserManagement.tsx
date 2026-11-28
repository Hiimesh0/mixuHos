import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, ShieldCheck, Key, Edit2, Trash2, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';
import { authApi, type UserRecord, type RoleRecord } from '../../api/authApi';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';
import styles from './UserManagement.module.css';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPwdModalOpen, setIsResetPwdModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    role_id: 'doctor',
    department: 'Cardiology',
    password: '',
    confirm_password: '',
    is_active: true
  });

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uList, rList] = await Promise.all([authApi.getUsers(), authApi.getRoles()]);
      setUsers(uList);
      setRoles(rList);
    } catch {
      setNotification({ type: 'error', message: 'Failed to load staff users directory.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setFormData({
      full_name: '',
      username: '',
      email: '',
      phone: '',
      role_id: roles[0]?.id || 'doctor',
      department: 'Clinical Care',
      password: '',
      confirm_password: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: UserRecord) => {
    setSelectedUser(u);
    setFormData({
      full_name: u.full_name,
      username: u.username,
      email: u.email,
      phone: u.phone || '',
      role_id: u.role_id,
      department: u.department || '',
      password: '',
      confirm_password: '',
      is_active: u.is_active
    });
    setIsModalOpen(true);
  };

  const handleOpenResetPwdModal = (u: UserRecord) => {
    setSelectedUser(u);
    setNewPassword('');
    setIsResetPwdModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser && (!formData.password || formData.password.length < 6)) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (!selectedUser && formData.password !== formData.confirm_password) {
      setNotification({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      await authApi.saveUser({
        ...(selectedUser ? { id: selectedUser.id } : {}),
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role_id: formData.role_id,
        department: formData.department,
        is_active: formData.is_active,
        ...(formData.password ? { password: formData.password } : {})
      });

      setIsModalOpen(false);
      setNotification({
        type: 'success',
        message: selectedUser ? `Staff profile for ${formData.username} updated.` : `New staff user ${formData.username} created.`
      });
      await loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save staff user.' });
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword.trim()) return;
    if (newPassword.trim().length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      await authApi.saveUser({
        id: selectedUser.id,
        password: newPassword.trim()
      });
      setIsResetPwdModalOpen(false);
      setNotification({ type: 'success', message: `Password for ${selectedUser.username} securely reset and hashed with PBKDF2.` });
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({ type: 'error', message: 'Failed to reset password.' });
    }
  };

  const handleToggleActive = async (u: UserRecord) => {
    if (u.username === 'admin') {
      setNotification({ type: 'error', message: 'Primary Super Admin account cannot be deactivated.' });
      return;
    }
    try {
      await authApi.saveUser({
        id: u.id,
        is_active: !u.is_active
      });
      await loadData();
      setNotification({ type: 'success', message: `Account status for ${u.username} set to ${!u.is_active ? 'Active' : 'Inactive'}.` });
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({ type: 'error', message: 'Failed to update user status.' });
    }
  };

  const handleDeleteUser = async (u: UserRecord) => {
    if (u.username === 'admin') {
      setNotification({ type: 'error', message: 'Primary Super Admin cannot be deleted.' });
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user account '${u.username}'?`)) return;

    try {
      await authApi.deleteUser(u.id);
      setNotification({ type: 'success', message: `Staff user '${u.username}' deleted.` });
      await loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({ type: 'error', message: 'Failed to delete staff user.' });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = selectedRoleFilter === 'all' || u.role_id === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className={`${styles.container} hasBottomActionBar`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.tagWrap}>
            <Users size={16} color="#0284c7" />
            <span className={styles.tag}>Staff Access Administration</span>
          </div>
          <h1 className={styles.title}>User Management Directory</h1>
          <p className={styles.subtitle}>
            Manage authorized hospital personnel accounts, assign roles, enforce PBKDF2 password hashing, and audit activity.
          </p>
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={handleOpenAddModal}
        >
          <UserPlus size={16} />
          <span>Provision New Staff User</span>
        </button>
      </div>

      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchBox}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by name, username, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.roleFilterGroup}>
          <label style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Filter by Role:</label>
          <select
            className={styles.selectFilter}
            value={selectedRoleFilter}
            onChange={e => setSelectedRoleFilter(e.target.value)}
          >
            <option value="all">All Roles ({users.length})</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Username</th>
              <th>Assigned Role</th>
              <th>Department</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  Loading staff accounts directory...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No staff accounts found matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const roleObj = roles.find(r => r.id === u.role_id);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.full_name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {u.id}</div>
                    </td>
                    <td>
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                        {u.username}
                      </code>
                    </td>
                    <td>
                      <span className={styles.roleBadge}>
                        <ShieldCheck size={13} />
                        {roleObj?.name || u.role_id}
                      </span>
                    </td>
                    <td>{u.department || 'General'}</td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#334155' }}>{u.email}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{u.phone || '--'}</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className={u.is_active ? styles.statusActive : styles.statusInactive}
                        title="Click to toggle account activation status"
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>
                      {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleOpenResetPwdModal(u)}
                          title="Reset Password"
                        >
                          <Key size={14} color="#0284c7" />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit User"
                        >
                          <Edit2 size={14} color="#475569" />
                        </button>
                        {u.username !== 'admin' && (
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => handleDeleteUser(u)}
                            title="Delete User"
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onSave={handleOpenAddModal}
        saveLabel="Provision User"
        onCancel={loadData}
        cancelLabel="Refresh Directory"
        onPrint={() => window.print()}
        printLabel="Print Directory"
        statusMessage={`Total Staff Accounts: ${users.length} • Active: ${users.filter(u => u.is_active).length}`}
      />

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                {selectedUser ? `Edit Staff Account: ${selectedUser.username}` : 'Provision New Staff User'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className={styles.formRow}>
                <div>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Dr. Sneha Joshi"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Username *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(selectedUser)}
                    className={styles.formInput}
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. sneha_joshi"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div>
                  <label className={styles.formLabel}>Official Email *</label>
                  <input
                    type="email"
                    required
                    className={styles.formInput}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sneha.joshi@mixuhospital.com"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div>
                  <label className={styles.formLabel}>Assigned Role *</label>
                  <select
                    className={styles.formSelect}
                    value={formData.role_id}
                    onChange={e => setFormData({ ...formData, role_id: e.target.value })}
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Department</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Pediatrics / ICU"
                  />
                </div>
              </div>

              {!selectedUser && (
                <div className={styles.formRow}>
                  <div>
                    <label className={styles.formLabel}>Initial Password *</label>
                    <input
                      type="password"
                      required
                      className={styles.formInput}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Confirm Password *</label>
                    <input
                      type="password"
                      required
                      className={styles.formInput}
                      value={formData.confirm_password}
                      onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                      placeholder="Re-type password"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {selectedUser ? 'Save Changes' : 'Create User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPwdModalOpen && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setIsResetPwdModalOpen(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Lock size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                Reset Password: {selectedUser.username}
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Enter a secure new password for <strong>{selectedUser.full_name}</strong>. The password will be hashed with PBKDF2 before storage.
            </p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className={styles.formLabel}>New Password *</label>
                <input
                  type="password"
                  required
                  className={styles.formInput}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsResetPwdModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reset &amp; Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

