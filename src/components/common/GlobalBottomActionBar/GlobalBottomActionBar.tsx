import React, { useEffect, useCallback, useState } from 'react';
import { Save, Printer, Edit3, X, Trash2, CheckCircle2 } from 'lucide-react';
import styles from './GlobalBottomActionBar.module.css';

export interface GlobalBottomActionBarProps {
  /** Save action trigger (Ctrl+S / Cmd+S) */
  onSave?: () => void | Promise<void>;
  /** Edit action trigger */
  onEdit?: () => void;
  /** Print action trigger (Ctrl+P / Cmd+P) */
  onPrint?: () => void | Promise<void>;
  /** Cancel or Reset action trigger (Esc) */
  onCancel?: () => void;
  /** Delete action trigger */
  onDelete?: () => void | Promise<void>;

  /** Custom labels */
  saveLabel?: string;
  editLabel?: string;
  printLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;

  /** Loading states */
  isSaving?: boolean;
  isPrinting?: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;

  /** Disabled flags */
  saveDisabled?: boolean;
  editDisabled?: boolean;
  printDisabled?: boolean;
  cancelDisabled?: boolean;
  deleteDisabled?: boolean;

  /** Whether keyboard shortcuts (Ctrl+S, Ctrl+P, Esc) are active. Defaults to true. */
  enableShortcuts?: boolean;

  /** Status message or indicator displayed on the left */
  statusMessage?: React.ReactNode;

  /** Whether the current form has unsaved modifications */
  isDirty?: boolean;
  /** Custom dirty badge label (defaults to 'Unsaved Changes') */
  dirtyMessage?: string;

  /** Additional actions slot (e.g. module-specific buttons) */
  extraActions?: React.ReactNode;

  /** Left-side custom content slot */
  leftSlot?: React.ReactNode;

  /** Additional CSS class for outer container */
  className?: string;
}

export const GlobalBottomActionBar: React.FC<GlobalBottomActionBarProps> = ({
  onSave,
  onEdit,
  onPrint,
  onCancel,
  onDelete,
  saveLabel = 'Save Record',
  editLabel = 'Edit',
  printLabel = 'Print',
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  isSaving = false,
  isPrinting = false,
  isEditing = false,
  isDeleting = false,
  saveDisabled = false,
  editDisabled = false,
  printDisabled = false,
  cancelDisabled = false,
  deleteDisabled = false,
  enableShortcuts = true,
  statusMessage,
  isDirty = false,
  dirtyMessage = 'Unsaved Changes',
  extraActions,
  leftSlot,
  className = ''
}) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = typeof navigator !== 'undefined'
      ? (navigator.platform || (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.userAgent || '')
      : '';
    setIsMac(platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Global Keyboard Shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enableShortcuts) return;

      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+S / Cmd+S: Save
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        if (onSave && !saveDisabled && !isSaving) {
          e.preventDefault();
          e.stopPropagation();
          onSave();
        }
      }

      // Ctrl+P / Cmd+P: Print
      if (cmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        if (onPrint && !printDisabled && !isPrinting) {
          e.preventDefault();
          e.stopPropagation();
          onPrint();
        }
      }

      // Esc: Cancel / Reset
      if (e.key === 'Escape') {
        if (onCancel && !cancelDisabled) {
          e.preventDefault();
          onCancel();
        }
      }
    },
    [enableShortcuts, isMac, onSave, saveDisabled, isSaving, onPrint, printDisabled, isPrinting, onCancel, cancelDisabled]
  );

  useEffect(() => {
    if (!enableShortcuts) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableShortcuts, handleKeyDown]);

  return (
    <footer
      className={`${styles.bottomBarWrapper} ${className}`}
      role="region"
      aria-label="Action Toolbar"
    >
      {/* Left Slot: Status, Dirty Badge & Shortcuts */}
      <div className={styles.leftSlot}>
        {leftSlot}

        {isDirty && (
          <div
            className={styles.dirtyIndicator}
            title="You have unsaved changes in this record"
            role="status"
            aria-live="polite"
          >
            <span className={styles.dirtyDot} />
            <span>{dirtyMessage}</span>
          </div>
        )}

        {statusMessage && (
          <div className={styles.statusMessage} role="status" aria-live="polite">
            <CheckCircle2 size={15} color="#10b981" />
            <span>{statusMessage}</span>
          </div>
        )}

        {enableShortcuts && (
          <div className={styles.shortcutHints} aria-label="Keyboard Shortcuts">
            {onSave && (
              <span>
                <kbd className={styles.shortcutBadge}>{isMac ? '⌘S' : 'Ctrl+S'}</kbd> Save
              </span>
            )}
            {onPrint && (
              <span>
                <kbd className={styles.shortcutBadge}>{isMac ? '⌘P' : 'Ctrl+P'}</kbd> Print
              </span>
            )}
            {onCancel && (
              <span>
                <kbd className={styles.shortcutBadge}>Esc</kbd> Cancel
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Slot: Extra Actions + Standard Action Buttons */}
      <div className={styles.actionsGroup}>
        {extraActions}

        {onCancel && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
            disabled={cancelDisabled}
            title={`${cancelLabel} (Esc)`}
          >
            <X size={15} />
            <span>{cancelLabel}</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDelete}`}
            onClick={onDelete}
            disabled={deleteDisabled || isDeleting}
            title={deleteLabel}
          >
            {isDeleting ? <span className={`${styles.spinner} ${styles.spinnerDark}`} /> : <Trash2 size={15} />}
            <span>{isDeleting ? 'Deleting...' : deleteLabel}</span>
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnEdit}`}
            onClick={onEdit}
            disabled={editDisabled || isEditing}
            title={editLabel}
          >
            <Edit3 size={15} />
            <span>{editLabel}</span>
          </button>
        )}

        {onPrint && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrint}`}
            onClick={onPrint}
            disabled={printDisabled || isPrinting}
            title={`${printLabel} (${isMac ? '⌘P' : 'Ctrl+P'})`}
          >
            {isPrinting ? <span className={`${styles.spinner} ${styles.spinnerDark}`} /> : <Printer size={15} />}
            <span>{isPrinting ? 'Printing...' : printLabel}</span>
          </button>
        )}

        {onSave && (
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSave}`}
            onClick={onSave}
            disabled={saveDisabled || isSaving}
            title={`${saveLabel} (${isMac ? '⌘S' : 'Ctrl+S'})`}
          >
            {isSaving ? <span className={styles.spinner} /> : <Save size={15} />}
            <span>{isSaving ? 'Saving...' : saveLabel}</span>
          </button>
        )}
      </div>
    </footer>
  );
};

export default GlobalBottomActionBar;
