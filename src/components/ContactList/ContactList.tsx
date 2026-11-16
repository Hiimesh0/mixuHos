import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, Printer, Search, RefreshCw, CheckCircle2, AlertCircle, Save, X } from 'lucide-react';
import styles from './ContactList.module.css';
import { contactApi, type ContactRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formDept, setFormDept] = useState<string>('');
  const [formDesignation, setFormDesignation] = useState<string>('');
  const [formIntercomm, setFormIntercomm] = useState<string>('');
  const [formMobile, setFormMobile] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await contactApi.getAll();
      setContacts(list);
    } catch {
      setNotification({ type: 'error', message: 'Failed to load contacts.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (!c.is_active) return false;
      if (searchName.trim()) {
        const q = searchName.toLowerCase();
        const matchesName = (c.name || '').toLowerCase().includes(q);
        const matchesDept = (c.department || '').toLowerCase().includes(q);
        const matchesMob = (c.mobile || '').includes(q);
        const matchesExt = (c.intercomm || '').includes(q);
        if (!matchesName && !matchesDept && !matchesMob && !matchesExt) return false;
      }
      return true;
    });
  }, [contacts, searchName]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormDept('General Administration');
    setFormDesignation('Staff');
    setFormIntercomm('101');
    setFormMobile('');
    setFormEmail('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ContactRecord) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormDept(c.department || '');
    setFormDesignation(c.designation || '');
    setFormIntercomm(c.intercomm || '');
    setFormMobile(c.mobile || '');
    setFormEmail(c.email || '');
    setIsModalOpen(true);
  };

  const handleSaveContact = async () => {
    if (!formName.trim() || !formMobile.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Contact Name and Mobile Number.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<ContactRecord> = {
        name: formName,
        department: formDept,
        designation: formDesignation,
        intercomm: formIntercomm,
        mobile: formMobile,
        email: formEmail,
        is_active: true,
      };

      if (editingId) {
        await contactApi.update(editingId, payload);
        setNotification({ type: 'success', message: `Contact '${formName}' updated!` });
      } else {
        await contactApi.create(payload);
        setNotification({ type: 'success', message: `Contact '${formName}' added to directory!` });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving contact.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = window.confirm(`Remove '${name}' from directory?`);
    if (!ok) return;

    try {
      setLoading(true);
      await contactApi.delete(id, false);
      setNotification({ type: 'success', message: `Contact '${name}' removed.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to delete contact.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintDirectory = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = filteredContacts.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.designation || '-'}</td>
        <td>${c.department || '-'}</td>
        <td style="font-weight: 700; color: #2563eb;">${c.intercomm || '-'}</td>
        <td>${c.mobile}</td>
        <td>${c.email || '-'}</td>
      </tr>
    `).join('');

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hospital Internal Telephone & Intercom Directory</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #1e293b; }
          h2 { text-align: center; color: #1e3a8a; margin-bottom: 4px; }
          p { text-align: center; color: #64748b; font-size: 13px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { background: #f1f5f9; padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left; }
          td { padding: 8px 12px; border: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h2>HOSPITAL INTERNAL CONTACT & INTERCOMM DIRECTORY</h2>
        <p>Total Staff & Department Extensions: ${filteredContacts.length}</p>
        <table>
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Intercom Ext</th>
              <th>Mobile Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button onClick={dismissNotification} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Hospital Telephone & Intercom Directory</h1>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Search Contacts</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Name, Department, Intercom, Mobile..."
                className={styles.input}
                style={{ paddingLeft: '36px', width: '320px' }}
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.primaryBtn} onClick={handleOpenAdd} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Plus size={16} /> Add Contact
          </button>
          <button className={styles.secondaryBtn} onClick={handlePrintDirectory}>
            <Printer size={16} /> Print Directory
          </button>
          <button className={styles.secondaryBtn} onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Staff / Doctor Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th style={{ width: '130px' }}>Intercomm Ext</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No contacts found. Click "+ Add Contact" to add to directory.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td style={{ fontWeight: 700, color: '#1e3a8a' }}>{c.name}</td>
                    <td>{c.designation || '-'}</td>
                    <td>{c.department || '-'}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{c.intercomm || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{c.mobile}</td>
                    <td>{c.email || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                          title="Edit contact"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          title="Delete contact"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e3a8a' }}>{editingId ? 'Edit Contact' : 'Add New Contact'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
                <input type="text" className={styles.input} style={{ width: '100%' }} value={formName} onChange={e => setFormName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Department</label>
                  <input type="text" className={styles.input} style={{ width: '100%' }} value={formDept} onChange={e => setFormDept(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Designation</label>
                  <input type="text" className={styles.input} style={{ width: '100%' }} value={formDesignation} onChange={e => setFormDesignation(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Intercom Ext</label>
                  <input type="text" className={styles.input} style={{ width: '100%' }} value={formIntercomm} onChange={e => setFormIntercomm(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Mobile Number *</label>
                  <input type="tel" className={styles.input} style={{ width: '100%' }} value={formMobile} onChange={e => setFormMobile(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Email</label>
                <input type="email" className={styles.input} style={{ width: '100%' }} value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={handleSaveContact} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
                <Save size={16} /> Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
