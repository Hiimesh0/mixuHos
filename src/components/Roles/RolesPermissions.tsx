import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Save, Trash2, CheckSquare, Square, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi, type RoleRecord, type PagePermission, REGISTERED_PAGES } from '../../api/authApi';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';
import styles from './RolesPermissions.module.css';

export const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('super_admin');
  const [activeRole, setActiveRole] = useState<RoleRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New role modal state
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const list = await authApi.getRoles();
      setRoles(list);
      if (list.length > 0) {
        const current = list.find(r => r.id === selectedRoleId) || list[0];
        setActiveRole(JSON.parse(JSON.stringify(current)));
        setSelectedRoleId(current.id);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load roles from server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (rId: string) => {
    setSelectedRoleId(rId);
    const found = roles.find(r => r.id === rId);
    if (found) {
      setActiveRole(JSON.parse(JSON.stringify(found)));
    }
  };

  const handlePermissionChange = (pageId: string, op: keyof PagePermission, checked: boolean) => {
    if (!activeRole) return;
    const permissions = { ...activeRole.permissions };
    const current = permissions[pageId] || {
      access: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
      print: false,
      export: false
    };

    const updated = { ...current, [op]: checked };
    // If access is unchecked, disable all child operations
    if (op === 'access' && !checked) {
      updated.view = false;
      updated.create = false;
      updated.edit = false;
      updated.delete = false;
      updated.print = false;
      updated.export = false;
    }
    // If an operation is checked, ensure page access is on
    if (op !== 'access' && checked) {
      updated.access = true;
      updated.view = true;
    }

    permissions[pageId] = updated;
    setActiveRole({ ...activeRole, permissions });
  };

  const handleSelectAllForPage = (pageId: string, enable: boolean) => {
    if (!activeRole) return;
    const permissions = { ...activeRole.permissions };
    permissions[pageId] = {
      access: enable,
      view: enable,
      create: enable,
      edit: enable,
      delete: enable,
      print: enable,
      export: enable
    };
    setActiveRole({ ...activeRole, permissions });
  };

  const handleSelectAllPages = (enable: boolean) => {
    if (!activeRole) return;
    const permissions: Record<string, PagePermission> = {};
    REGISTERED_PAGES.forEach(p => {
      permissions[p.id] = {
        access: enable,
        view: enable,
        create: enable,
        edit: enable,
        delete: enable,
        print: enable,
        export: enable
      };
    });
    setActiveRole({ ...activeRole, permissions });
  };

  const handleSaveRole = async () => {
    if (!activeRole) return;
    try {
      setSaving(true);
      await authApi.saveRole(activeRole);
      setNotification({ type: 'success', message: `Permissions for role '${activeRole.name}' saved successfully.` });
      await loadRoles();
      setTimeout(() => setNotification(null), 3500);
    } catch {
      setNotification({ type: 'error', message: 'Failed to save role permissions.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const id = newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newRole: RoleRecord = {
      id,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || 'Custom hospital staff role',
      is_active: true,
      permissions: REGISTERED_PAGES.reduce((acc, p) => {
        acc[p.id] = { access: false, view: false, create: false, edit: false, delete: false, print: false, export: false };
        return acc;
      }, {} as Record<string, PagePermission>)
    };

    try {
      await authApi.saveRole(newRole);
      setIsNewRoleModalOpen(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setNotification({ type: 'success', message: `Custom role '${newRole.name}' created. Configure permissions below.` });
      await loadRoles();
      handleSelectRole(newRole.id);
    } catch {
      setNotification({ type: 'error', message: 'Failed to create new role.' });
    }
  };

  const filteredPages = REGISTERED_PAGES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.tagWrap}>
            <ShieldCheck size={16} color="#0284c7" />
            <span className={styles.tag}>Role-Based Access Control</span>
          </div>
          <h1 className={styles.title}>Roles &amp; Granular Permissions Matrix</h1>
          <p className={styles.subtitle}>
            Enforce page-level access and operation-level authority (View, Create, Edit, Delete, Print, Export) across all institutional modules.
          </p>
        </div>

        <button
          type="button"
          className={styles.addRoleBtn}
          onClick={() => setIsNewRoleModalOpen(true)}
        >
          <Plus size={16} />
          <span>Create Custom Role</span>
        </button>
      </div>

      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className={styles.rolesTabBar}>
        {roles.map(r => (
          <button
            key={r.id}
            type="button"
            className={`${styles.roleTab} ${selectedRoleId === r.id ? styles.roleTabActive : ''}`}
            onClick={() => handleSelectRole(r.id)}
          >
            <span className={styles.roleTabName}>{r.name}</span>
            {r.is_system && <span className={styles.systemBadge}>System</span>}
          </button>
        ))}
      </div>

      {activeRole && (
        <div className={styles.matrixCard}>
          <div className={styles.matrixTopBar}>
            <div>
              <h3 className={styles.activeRoleTitle}>{activeRole.name}</h3>
              <p className={styles.activeRoleDesc}>{activeRole.description}</p>
            </div>

            <div className={styles.matrixActions}>
              <div className={styles.searchBox}>
                <Search size={14} color="#64748b" />
                <input
                  type="text"
                  placeholder="Filter pages or category..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button
                type="button"
                className={styles.bulkBtn}
                onClick={() => handleSelectAllPages(true)}
              >
                <CheckSquare size={14} /> Select All
              </button>
              <button
                type="button"
                className={styles.bulkBtn}
                onClick={() => handleSelectAllPages(false)}
              >
                <Square size={14} /> Deselect All
              </button>
            </div>
          </div>

          {/* Permission Matrix Table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Hospital Module / Page</th>
                  <th style={{ width: '12%' }}>Category</th>
                  <th style={{ width: '10%' }}>Page Access</th>
                  <th style={{ width: '8%' }}>View</th>
                  <th style={{ width: '8%' }}>Add / Create</th>
                  <th style={{ width: '8%' }}>Edit / Save</th>
                  <th style={{ width: '8%' }}>Delete</th>
                  <th style={{ width: '9%' }}>Print</th>
                  <th style={{ width: '9%' }}>Export</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map(page => {
                  const perm = activeRole.permissions?.[page.id] || {
                    access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    print: false,
                    export: false
                  };
                  return (
                    <tr key={page.id} className={perm.access ? styles.rowActive : styles.rowDisabled}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{page.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Route: {page.route}</div>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>{page.category}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className={styles.checkboxPrimary}
                          checked={perm.access}
                          onChange={e => handlePermissionChange(page.id, 'access', e.target.checked)}
                          title="Toggle whole page visibility in sidebar and routing"
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.view}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'view', e.target.checked)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.create}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'create', e.target.checked)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.edit}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'edit', e.target.checked)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'delete', e.target.checked)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.print}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'print', e.target.checked)}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={perm.export}
                          disabled={!perm.access}
                          onChange={e => handlePermissionChange(page.id, 'export', e.target.checked)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Fixed Bottom Action Bar */}
      <GlobalBottomActionBar
        onSave={handleSaveRole}
        saveLabel={saving ? 'Saving Permissions...' : `Save ${activeRole?.name || 'Role'} Permissions`}
        isSaving={saving}
        onCancel={() => handleSelectRole(selectedRoleId)}
        cancelLabel="Reset Changes"
        statusMessage={`Role: ${activeRole?.name} • ${Object.values(activeRole?.permissions || {}).filter(p => p.access).length} of ${REGISTERED_PAGES.length} pages enabled`}
      />

      {/* Create Custom Role Modal */}
      {isNewRoleModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsNewRoleModalOpen(false)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#0f172a' }}>Create New Institutional Role</h3>
            <form onSubmit={handleCreateNewRole}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Nursing Officer, TPA Desk Manager"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Role Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the department responsibilities and operational scope..."
                  value={newRoleDesc}
                  onChange={e => setNewRoleDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewRoleModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;

