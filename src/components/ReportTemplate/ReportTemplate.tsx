import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare, 
  X, AlertCircle, CheckCircle2, ShieldAlert, FileText,
  List, Eye, Edit3, Plus, UserCheck
} from 'lucide-react';
import { reportTemplateApi, type ReportTemplateRecord } from '../../api/masterApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { useFormKeyboardNavigation } from '../../hooks/useFormKeyboardNavigation';
import { parseReportDetails, autoFormatToBullets } from '../../utils/reportDetailsFormatter';
import { openReportTemplatePrintView } from '../../utils/reportTemplatePrintGenerator';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import styles from './ReportTemplate.module.css';

const DEFAULT_TEMPLATE: ReportTemplateRecord = {
  id: '',
  groupName: 'Sonography',
  templateName: '',
  reportHeader: '',
  department: 'Radiology & Imaging',
  details: '',
  status: 'active'
};

const REPORT_GROUPS = [
  'Sonography',
  'Radiology',
  'Pathology',
  'Cardiology',
  'Echo',
  'Endoscopy',
  'Biochemistry',
  'General'
];

const ReportTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ReportTemplateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formData, setFormData] = useState<ReportTemplateRecord>(DEFAULT_TEMPLATE);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [shouldPrint, setShouldPrint] = useState<boolean>(true);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchGroup, setSearchGroup] = useState<string>('All');
  const [searchStatus, setSearchStatus] = useState<string>('All');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Registered Patients list for realistic preview & print binding
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPreviewPatient, setSelectedPreviewPatient] = useState<PatientRecord | null>(null);

  // Details Editor View Mode: 'edit' or 'preview' (Live Bullet Preview)
  const [editorViewMode, setEditorViewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Form Keyboard Navigation
  const { formRef, handleKeyDown: handleFormKeyDown } = useFormKeyboardNavigation();

  // Structured bullet parser for Details section
  const parsedDetails = useMemo(() => parseReportDetails(formData.details), [formData.details]);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
  }>();

  // Load registered patients on mount
  useEffect(() => {
    patientApi
      .getPatients()
      .then(res => {
        if (res.patients && res.patients.length > 0) {
          setPatients(res.patients);
        }
      })
      .catch(() => {});
  }, []);

  // Insert a bullet point at current cursor position
  const handleInsertBullet = () => {
    const ta = textareaRef.current;
    if (!ta) {
      handleInputChange('details', (formData.details ? `${formData.details}\n` : '') + '• ');
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = formData.details || '';
    const before = text.substring(0, start);
    const after = text.substring(end);
    const prefix = before.length > 0 && !before.endsWith('\n') ? '\n• ' : '• ';
    const newText = before + prefix + after;
    handleInputChange('details', newText);
    setTimeout(() => {
      ta.focus();
      const pos = start + prefix.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  // Auto-format plain lines into bullet points
  const handleAutoFormatBullets = () => {
    const formatted = autoFormatToBullets(formData.details);
    handleInputChange('details', formatted);
    setNotification({
      type: 'success',
      message: 'Report details formatted into clear bullet points.'
    });
  };

  // Open dedicated A4 print view
  const handlePrintReport = () => {
    openReportTemplatePrintView(formData, {
      patient: selectedPreviewPatient
    });
  };

  // Load templates from backend JSON storage
  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reportTemplateApi.getReportTemplates();
      const list = res.templates || [];
      setTemplates(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
        setIsCreateMode(false);
      } else {
        setFormData(DEFAULT_TEMPLATE);
        setIsCreateMode(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to report templates storage.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Sync formData when currentIndex changes
  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < templates.length) {
      setCurrentIndex(idx);
      setFormData(templates[idx]);
      setIsCreateMode(false);
      dismissNotification();
    }
  };

  // Field change handler
  const handleInputChange = (field: keyof ReportTemplateRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation
  const validateForm = (): string | null => {
    if (!formData.groupName || !formData.groupName.trim()) {
      return 'Group Name is required.';
    }
    if (!formData.templateName || formData.templateName.trim().length < 2) {
      return 'Template Name is required and must be at least 2 characters.';
    }
    if (!formData.details || !formData.details.trim()) {
      return 'Report Template Details/Content cannot be empty.';
    }
    return null;
  };

  // Add / Create Template
  const handleAddClick = async () => {
    if (!isCreateMode) {
      setIsCreateMode(true);
      const nextId = `TPL-${String(templates.length + 1).padStart(3, '0')}`;
      setFormData({
        ...DEFAULT_TEMPLATE,
        id: nextId
      });
      setNotification({
        type: 'success',
        message: 'New report template initialized. Enter template details and click "Save Template" to record.'
      });
      return;
    }

    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await reportTemplateApi.createReportTemplate(formData);
      setNotification({
        type: 'success',
        message: `Template "${res.template.templateName}" created successfully with ID ${res.template.id}.`
      });
      const updatedList = [...templates, res.template];
      setTemplates(updatedList);
      setCurrentIndex(updatedList.length - 1);
      setFormData(res.template);
      setIsCreateMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save template.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing template
  const handleUpdateClick = async () => {
    if (isCreateMode) {
      handleAddClick();
      return;
    }

    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await reportTemplateApi.updateReportTemplate(formData.id, formData);
      setNotification({
        type: 'success',
        message: `Template "${res.template.templateName}" (${res.template.id}) updated successfully.`
      });
      const updatedList = [...templates];
      updatedList[currentIndex] = res.template;
      setTemplates(updatedList);
      setFormData(res.template);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update template.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete or Deactivate
  const handleConfirmDelete = async (force: boolean) => {
    if (!formData.id) return;
    setIsSaving(true);
    try {
      const res = await reportTemplateApi.deleteReportTemplate(formData.id, force);
      setNotification({
        type: 'success',
        message: res.message
      });
      setIsDeleteModalOpen(false);

      if (res.action === 'deleted') {
        const updatedList = templates.filter(t => t.id !== formData.id);
        setTemplates(updatedList);
        if (updatedList.length > 0) {
          const nextIdx = Math.min(currentIndex, updatedList.length - 1);
          setCurrentIndex(nextIdx);
          setFormData(updatedList[nextIdx]);
        } else {
          setFormData(DEFAULT_TEMPLATE);
          setIsCreateMode(true);
        }
      } else {
        const updatedList = [...templates];
        updatedList[currentIndex] = { ...updatedList[currentIndex], status: 'inactive' };
        setTemplates(updatedList);
        setFormData(prev => ({ ...prev, status: 'inactive' }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered templates for search modal
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      if (searchStatus !== 'All' && t.status !== searchStatus) return false;
      if (searchGroup !== 'All' && t.groupName !== searchGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          t.templateName.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          (t.reportHeader && t.reportHeader.toLowerCase().includes(q)) ||
          t.groupName.toLowerCase().includes(q) ||
          (t.department && t.department.toLowerCase().includes(q)) ||
          t.details.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [templates, searchQuery, searchGroup, searchStatus]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>
          {isCreateMode
            ? `New (Total: ${templates.length})`
            : `${templates.length > 0 ? currentIndex + 1 : 0} Of ${templates.length}`}
        </span>

        <h1 className={styles.pageTitle}>Report Template</h1>

        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-soft, #e8f0fe)', padding: '6px 12px', borderRadius: '6px' }}>
          ID: {isCreateMode ? `${formData.id || 'Pending'}` : formData.id || '--'}
        </span>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={dismissNotification}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form Container with Keyboard Navigation */}
      <form
        ref={formRef}
        onKeyDown={handleFormKeyDown}
        onSubmit={e => {
          e.preventDefault();
          handleUpdateClick();
        }}
        className={styles.formContainer}
      >
        <div className={styles.mainSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Group Name :</label>
            <select
              className={styles.select}
              style={{ flex: 1 }}
              value={formData.groupName}
              onChange={e => handleInputChange('groupName', e.target.value)}
            >
              {REPORT_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <label className={styles.label} style={{ width: '100px' }}>Department :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Radiology, Sonography"
              value={formData.department || ''}
              onChange={e => handleInputChange('department', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>TemplateName :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. COLOR DOPPLER BOTH UPPER LIMB"
              value={formData.templateName}
              onChange={e => handleInputChange('templateName', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>ReportHeader :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. BILATERAL UPPER LIMB DOPPLER"
              value={formData.reportHeader || ''}
              onChange={e => handleInputChange('reportHeader', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup} style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
            <div className={styles.detailsHeaderRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className={styles.label} style={{ textAlign: 'left', width: 'auto', paddingTop: 0 }}>
                  Details of the Report :
                </label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ({parsedDetails.items.length} Bullet Points)
                </span>
              </div>

              <div className={styles.detailsToolbar}>
                <button
                  type="button"
                  className={styles.toolbarBtn}
                  onClick={handleInsertBullet}
                  title="Insert a bullet point at cursor (•)"
                >
                  <Plus size={13} /> Add Bullet
                </button>
                <button
                  type="button"
                  className={styles.toolbarBtn}
                  onClick={handleAutoFormatBullets}
                  title="Automatically convert lines into bullet points"
                >
                  <List size={13} /> Format as Bullets
                </button>
                <button
                  type="button"
                  className={`${styles.toolbarBtn} ${editorViewMode === 'edit' ? styles.toolbarBtnActive : ''}`}
                  onClick={() => setEditorViewMode('edit')}
                  title="Edit raw text"
                >
                  <Edit3 size={13} /> Edit Text
                </button>
                <button
                  type="button"
                  className={`${styles.toolbarBtn} ${editorViewMode === 'preview' ? styles.toolbarBtnActive : ''}`}
                  onClick={() => setEditorViewMode('preview')}
                  title="Preview bullet points alignment"
                >
                  <Eye size={13} /> Live Preview
                </button>
              </div>
            </div>

            {editorViewMode === 'edit' ? (
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                rows={12}
                style={{ width: '100%', minHeight: '260px', fontFamily: 'monospace, sans-serif', fontSize: '13px', lineHeight: 1.6 }}
                placeholder="Enter structured findings, clinical remarks, observations, impressions... (Each line can start with • or SECTION:)"
                value={formData.details}
                onChange={e => handleInputChange('details', e.target.value)}
              />
            ) : (
              <div className={styles.liveBulletPreviewBox}>
                {parsedDetails.items.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>
                    No details entered yet. Type findings in edit mode to see live bullet formatting.
                  </div>
                ) : (
                  <div>
                    {parsedDetails.items.map((item, idx) => (
                      <div key={item.id || idx} className={styles.liveBulletItem}>
                        <span className={styles.liveBulletDot}>•</span>
                        <div style={{ flex: 1 }}>
                          {item.label && <strong className={styles.liveBulletLabel}>{item.label} </strong>}
                          <span>{item.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {parsedDetails.impressionTitle && (
                  <div className={styles.liveImpressionCard}>
                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: 'var(--text-main)' }}>
                      {parsedDetails.impressionTitle}:
                    </div>
                    {parsedDetails.impressionLines.map((line, lIdx) => (
                      <div key={lIdx} style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Status :</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'active'}
                  onChange={() => handleInputChange('status', 'active')}
                /> Active
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'inactive'}
                  onChange={() => handleInputChange('status', 'inactive')}
                /> Inactive
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            title="First Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(0)}
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Previous Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Next Record"
            disabled={currentIndex >= templates.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex + 1)}
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Last Record"
            disabled={currentIndex >= templates.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(templates.length - 1)}
          >
            <ChevronsRight size={18} />
          </button>
        </div>

        <div className={styles.middleActions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsPreviewModalOpen(true)}
            title="Preview Template Print Layout"
          >
            <Printer size={16} /> Print Preview
          </button>

          <div
            className={styles.checkboxItem}
            onClick={() => setShouldPrint(!shouldPrint)}
            style={{ marginLeft: '8px', marginRight: '16px' }}
          >
            {shouldPrint ? (
              <CheckSquare size={18} color="var(--primary)" />
            ) : (
              <Square size={18} color="var(--text-muted)" />
            )}
          </div>

          <button
            type="button"
            className={styles.secondaryBtn}
            title="Particular Search (Binoculars)"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={16} /> Search
          </button>
        </div>

        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={isSaving}
            onClick={handleAddClick}
          >
            <Save size={16} /> {isCreateMode ? 'Save Template' : 'Add'}
          </button>

          {!isCreateMode && (
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={isSaving}
              onClick={handleUpdateClick}
            >
              <Edit2 size={16} /> Update
            </button>
          )}

          {!isCreateMode && (
            <button
              type="button"
              className={styles.dangerBtn}
              disabled={isSaving}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} /> Delete
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryBtn}
            style={{ marginLeft: '8px' }}
            onClick={() => navigate('/')}
          >
            <LogOut size={16} /> Exit
          </button>
        </div>
      </div>

      {/* Particular Search Modal (Binoculars) */}
      {isSearchOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Search size={18} color="var(--primary)" /> Search Report Templates
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.searchToolbar}>
                <div className={styles.searchBox}>
                  <Search size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search by Template Name, Code, Group Name, or Header..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className={styles.filterRow}>
                  <select
                    className={styles.filterSelect}
                    value={searchGroup}
                    onChange={e => setSearchGroup(e.target.value)}
                  >
                    <option value="All">All Groups</option>
                    {REPORT_GROUPS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={searchStatus}
                    onChange={e => setSearchStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Showing {filteredTemplates.length} of {templates.length} templates
                  </span>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.modalTable}>
                  <thead>
                    <tr>
                      <th>Template Code</th>
                      <th>Template Name</th>
                      <th>Group Name</th>
                      <th>Report Header</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyState}>
                          No report templates match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map(tpl => (
                        <tr
                          key={tpl.id}
                          className={`${styles.tableRow} ${tpl.id === formData.id ? styles.tableRowSelected : ''}`}
                          onClick={() => {
                            const idx = templates.findIndex(t => t.id === tpl.id);
                            if (idx !== -1) handleSelectIndex(idx);
                            setIsSearchOpen(false);
                          }}
                        >
                          <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{tpl.id}</td>
                          <td><strong>{tpl.templateName}</strong></td>
                          <td>{tpl.groupName}</td>
                          <td>{tpl.reportHeader || '-'}</td>
                          <td>
                            {tpl.status === 'active' ? (
                              <span className={styles.badgeActive}>Active</span>
                            ) : (
                              <span className={styles.badgeInactive}>Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Deactivate Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: 'var(--danger)' }}>
                <ShieldAlert size={20} /> Delete or Deactivate Template
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                You are about to remove template <strong>{formData.templateName} ({formData.id})</strong>.
              </p>
              <div style={{ backgroundColor: 'var(--warning-soft)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-main)' }}>
                <strong>Clinical Documentation Integrity:</strong> Deactivation prevents future report selections while preserving patient reports that were generated using this template.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => handleConfirmDelete(false)}
              >
                Deactivate (Safe)
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => handleConfirmDelete(true)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional A4 Document Preview Modal */}
      {isPreviewModalOpen && (
        <div className={styles.previewBackdrop} onClick={() => setIsPreviewModalOpen(false)}>
          <div className={styles.previewContainer} onClick={e => e.stopPropagation()}>
            {/* Top Toolbar outside document */}
            <div className={styles.previewToolbar}>
              <div className={styles.previewToolbarLeft}>
                <FileText size={18} color="#60a5fa" />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>A4 Report Document Preview</span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>|</span>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={14} /> Sample Patient Data:
                  <select
                    className={styles.previewPatientSelect}
                    value={selectedPreviewPatient?.id || ''}
                    onChange={e => {
                      const p = patients.find(item => item.id === e.target.value);
                      setSelectedPreviewPatient(p || null);
                    }}
                  >
                    <option value="">Clinical Verification Default</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.uhid})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handlePrintReport}
                  style={{ background: 'var(--primary)', height: '34px', fontSize: '12px' }}
                >
                  <Printer size={15} /> Print Document (A4)
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsPreviewModalOpen(false)}
                  style={{ background: '#334155', color: '#fff', borderColor: '#475569', height: '34px', fontSize: '12px' }}
                >
                  <X size={15} /> Close Preview
                </button>
              </div>
            </div>

            {/* Document Sheet - Clean White A4 Hospital Surface */}
            <div className={styles.previewDocumentSheet}>
              {/* Department Header */}
              <div className={styles.docDepartmentHeader}>
                <h2 className={styles.docDepartmentName}>
                  DEPARTMENT OF {formData.groupName.toUpperCase()} &amp; DIAGNOSTICS
                </h2>
                <div className={styles.docDepartmentSub}>
                  {HOSPITAL_CONFIG.name} • {HOSPITAL_CONFIG.address}
                </div>
              </div>

              {/* Patient Info Table */}
              <table className={styles.docPatientTable}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%' }}>
                      <span className={styles.docInfoLabel}>Patient Name:</span>
                      <span className={styles.docInfoVal}>
                        {selectedPreviewPatient
                          ? `${selectedPreviewPatient.firstName} ${selectedPreviewPatient.middleName ? `${selectedPreviewPatient.middleName} ` : ''}${selectedPreviewPatient.lastName}`.trim()
                          : 'Sample Patient (Clinical Verification)'}
                      </span>
                    </td>
                    <td style={{ width: '50%' }}>
                      <span className={styles.docInfoLabel}>Report Date:</span>
                      <span className={styles.docInfoVal}>
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={styles.docInfoLabel}>UHID / ID:</span>
                      <span className={styles.docInfoVal}>
                        {selectedPreviewPatient?.uhid || formData.id || 'UHID-DEMO-01'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.docInfoLabel}>Age / Gender:</span>
                      <span className={styles.docInfoVal}>
                        {selectedPreviewPatient
                          ? `${selectedPreviewPatient.age} ${selectedPreviewPatient.ageUnit || 'Yrs'} / ${selectedPreviewPatient.sex}`
                          : '42 Yrs / Male'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className={styles.docInfoLabel}>Ref. Doctor:</span>
                      <span className={styles.docInfoVal}>
                        {selectedPreviewPatient?.hospitalDoctor || selectedPreviewPatient?.referenceBy || 'Dr. S. K. Mehta, MD (Med)'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.docInfoLabel}>Reporting Unit:</span>
                      <span className={styles.docInfoVal}>{formData.department || 'Radiology & Imaging'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Report Main Title */}
              <div className={styles.docTitleSection}>
                <h3 className={styles.docMainTitle}>
                  {formData.reportHeader || formData.templateName || 'INVESTIGATION REPORT'}
                </h3>
              </div>

              {/* Details of Report - Section Heading */}
              <div className={styles.docSectionHeading}>
                DETAILS OF THE REPORT
              </div>

              {/* Details Bullet Points List */}
              <div className={styles.docBulletsContainer}>
                {parsedDetails.items.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '13px' }}>
                    No template findings or observations recorded.
                  </div>
                ) : (
                  parsedDetails.items.map((item, idx) => (
                    <div key={item.id || idx} className={styles.docBulletItem}>
                      <span className={styles.docBulletDot}>•</span>
                      <div className={styles.docBulletText}>
                        {item.label && <strong className={styles.docBulletLabel}>{item.label} </strong>}
                        <span>{item.content}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Impression Box */}
              {parsedDetails.impressionTitle && (
                <div className={styles.docImpressionBox}>
                  <div className={styles.docImpressionTitle}>
                    {parsedDetails.impressionTitle}:
                  </div>
                  {parsedDetails.impressionLines.map((line, lIdx) => (
                    <div key={lIdx} className={styles.docImpressionLine}>
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Signatures Block */}
              <div className={styles.docSignaturesFooter}>
                <div className={styles.docSigBlock}>
                  <div className={styles.docSigTitle}>Medical Transcriptionist</div>
                  <div className={styles.docSigSubtitle}>Verified Diagnostic Format</div>
                </div>
                <div className={styles.docSigBlock} style={{ textAlign: 'right' }}>
                  <div className={styles.docSigTitle}>Consultant Radiologist / Pathologist</div>
                  <div className={styles.docSigSubtitle}>Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTemplate;
