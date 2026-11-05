import { useRef, useCallback } from 'react';

/**
 * Predefined logical sequence of fields for the Patient Registration form.
 * Matches the actual visual structure across all sections:
 * 1. Basic Information (Category, First, Middle, Last, DOB, Age, Unit, Sex, Doctor, Mobile, Email)
 * 2. Demographics & Clinical (Ref By, Religion, Marital, Weight, Height)
 * 3. Contact & Address (Street, City, State, PIN, AutoSMS)
 * 4. Other Details & Identification (Estimate, Aadhar, PAN, Mediclaim, Member ID, Emp ID, Company, Remark)
 */
export const PATIENT_REGISTRATION_FIELD_ORDER = [
  // Section 1: Basic Information
  'category',
  'firstName',
  'middleName',
  'lastName',
  'birthDate',
  'age',
  'ageMonths',
  'ageDays',
  'sex',
  'hospitalDoctor',
  'mobile',
  'email',

  // Section 2: Demographics & Clinical (Collapsible)
  'referenceBy',
  'religion',
  'maritalStatus',
  'weight',
  'height',

  // Section 3: Contact & Address (Collapsible)
  'streetAddress',
  'city',
  'state',
  'pinCode',
  'autoSms',

  // Section 4: Other Details & Identification (Collapsible)
  'estimate',
  'aadharNo',
  'panNo',
  'mediclaim',
  'membershipId',
  'employeeId',
  'companyName',
  'remark'
] as const;

/**
 * Echo Report Left-to-Right Row-Based Field Navigation Order
 * Moves horizontally across rows first, then proceeds down to the next row.
 */
export const ECHO_REPORT_FIELD_ORDER = [
  // Row 1: Patient details
  'patientName',
  'uhid',
  'age',
  'sex',
  'reportDate',

  // Row 2: Referred By & C/O
  'referredBy',
  'c_o',

  // Row 3: Mitral Valve, Aortic Valve, LVEF
  'mitralValve',
  'aorticValve',
  'lvef',

  // Row 4: Tricuspid Valve, Pulmonary Valve
  'tricuspidValve',
  'pulmonaryValve',

  // Row 5: Aorta, Left Atrium
  'aorta',
  'leftAtrium',

  // Row 6: Left Ventricle, Right Atrium
  'leftVentricle',
  'rightAtrium',

  // Row 7: RWMA, RVSP
  'rwma',
  'rvsp',

  // Row 8: Right Ventricle, IVS, Septum, LVIDd
  'rightVentricle',
  'ivs',
  'septum',
  'lvidd',

  // Row 9: IVC, IAS, P.Wall, LVIDs
  'ivc',
  'ias',
  'pWall',
  'lvids',

  // Row 10: Pericardium, LV. Compliance
  'pericardium',
  'lvCompliance',

  // Row 11: Doppler Study, TVI
  'dopplerStudy',
  'tvi',

  // Row 12: Left Aortic Arch / PDA / Coarctation
  'leftAorticArchPdaCoarctation',

  // Row 13: Conclusion, Consultant Dr.
  'conclusion',
  'consultantDr'
] as const;

export type PatientRegistrationFieldName = typeof PATIENT_REGISTRATION_FIELD_ORDER[number];
export type EchoReportFieldName = typeof ECHO_REPORT_FIELD_ORDER[number];

/**
 * Validates whether a DOM element is focusable and ready for keyboard interaction.
 * Skips hidden, disabled, read-only, and non-editable elements.
 */
export function isFieldFocusable(element: HTMLElement | null): boolean {
  if (!element) return false;

  // Check disabled state
  if ('disabled' in element && (element as HTMLInputElement | HTMLSelectElement | HTMLButtonElement).disabled) {
    return false;
  }

  // Check read-only state
  if ('readOnly' in element && (element as HTMLInputElement).readOnly) {
    return false;
  }

  // Check tabIndex
  if (element.tabIndex === -1) {
    return false;
  }

  // Check aria-hidden or hidden attribute
  if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  // Check visibility and dimensions (offsetParent is null if display: none or inside hidden container)
  if (element.offsetParent === null && window.getComputedStyle(element).position !== 'fixed') {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  return true;
}

/**
 * Focuses an element, scrolls it into view, and selects text for rapid inspection/editing.
 */
export function focusField(element: HTMLElement) {
  element.focus({ preventScroll: false });

  // Scroll smoothly ensuring comfortable visibility within form
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });

  // Select text if it's a text/number/email/tel input so clerks can immediately overwrite or inspect
  if (
    element instanceof HTMLInputElement &&
    ['text', 'tel', 'email', 'number', 'search'].includes(element.type)
  ) {
    try {
      element.select();
    } catch {
      // Ignore if browser restricts select
    }
  }
}

export interface UseFormKeyboardNavigationOptions {
  fieldOrder?: readonly string[];
  submitButtonSelector?: string;
  onNavigate?: (fromFieldName: string, toFieldName: string) => void;
}

/**
 * Custom React hook managing Enter-key navigation across forms in the hospital system.
 * 
 * Rules:
 * - Enter moves to the next logical field (left to right across current row, then down).
 * - Textareas retain normal multiline Enter behavior.
 * - Buttons retain normal Enter / Space activation.
 * - Dropdowns (selects) allow normal option selection.
 * - Tab / Shift+Tab retain default browser navigation.
 * - Never submits form accidentally when Enter is pressed in normal inputs.
 * - At the last field, moves focus to the primary action button without auto-submitting.
 */
export function useFormKeyboardNavigation(options?: UseFormKeyboardNavigationOptions) {
  const formRef = useRef<HTMLElement | null>(null);
  const explicitFieldOrder = options?.fieldOrder;
  const submitButtonSelector = options?.submitButtonSelector ?? 'button[type="submit"], .btnPrimaryAction, button.btnPrimary';

  const moveToNextField = useCallback(
    (currentElement?: HTMLElement) => {
      const container = formRef.current;
      if (!container) return;

      const active = currentElement || (document.activeElement as HTMLElement | null);
      if (!active) return;

      const currentName = active.getAttribute('name') || active.id || '';

      // MODE 1: Explicit Field Order provided (e.g. Patient Registration or Echo Report left-to-right)
      if (explicitFieldOrder && explicitFieldOrder.length > 0) {
        const currentIndex = currentName ? explicitFieldOrder.indexOf(currentName) : -1;

        if (currentIndex !== -1) {
          // Look ahead in explicit order
          for (let i = currentIndex + 1; i < explicitFieldOrder.length; i++) {
            const nextName = explicitFieldOrder[i];
            const candidate = container.querySelector<HTMLElement>(`[name="${nextName}"], #${nextName}`);
            if (candidate && isFieldFocusable(candidate)) {
              focusField(candidate);
              options?.onNavigate?.(currentName, nextName);
              return;
            }
          }

          // At end of fields, focus primary submit action button without submitting
          let submitBtn = container.querySelector<HTMLElement>(submitButtonSelector) || document.querySelector<HTMLElement>(submitButtonSelector);
          if (submitBtn && isFieldFocusable(submitBtn)) {
            focusField(submitBtn);
            options?.onNavigate?.(currentName, 'submitButton');
            return;
          }
        }
      }

      // MODE 2: Generic DOM / Visual Order (Left-to-Right, Top-to-Bottom)
      const allFormControls = Array.from(
        container.querySelectorAll<HTMLElement>(
          'input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => {
        // Exclude buttons from regular sequential stepping
        if (el.tagName === 'BUTTON' || (el instanceof HTMLInputElement && (el.type === 'button' || el.type === 'submit'))) {
          return false;
        }
        return isFieldFocusable(el);
      });

      if (allFormControls.length === 0) return;

      const currentIndexInDom = allFormControls.indexOf(active);
      if (currentIndexInDom !== -1 && currentIndexInDom < allFormControls.length - 1) {
        // Move to next input in DOM order
        const nextControl = allFormControls[currentIndexInDom + 1];
        focusField(nextControl);
        options?.onNavigate?.(currentName || `index_${currentIndexInDom}`, nextControl.getAttribute('name') || nextControl.id || `index_${currentIndexInDom + 1}`);
        return;
      }

      // If at last field or not found, focus action button
      const submitBtn = container.querySelector<HTMLElement>(submitButtonSelector) || document.querySelector<HTMLElement>(submitButtonSelector);
      if (submitBtn && isFieldFocusable(submitBtn) && active !== submitBtn) {
        focusField(submitBtn);
        options?.onNavigate?.(currentName || 'last', 'submitButton');
        return;
      }

      // Cycle back to first field if currently on submit button
      if (active === submitBtn && allFormControls.length > 0) {
        focusField(allFormControls[0]);
        options?.onNavigate?.('submitButton', allFormControls[0].getAttribute('name') || 'first');
      }
    },
    [explicitFieldOrder, submitButtonSelector, options]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // Only process Enter key
      if (e.key !== 'Enter') {
        return;
      }

      // Don't intercept if modified by Ctrl, Alt, or Meta
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      if (!activeElement || !formRef.current?.contains(activeElement)) {
        return;
      }

      // 1. Textarea: allow multiline Enter without moving focus
      if (activeElement.tagName === 'TEXTAREA') {
        return;
      }

      // 2. Button: allow default activation (Enter activates button)
      if (activeElement.tagName === 'BUTTON' || (activeElement instanceof HTMLInputElement && activeElement.type === 'button')) {
        return;
      }

      // 3. Normal input / select: prevent accidental form submission & advance to next field
      e.preventDefault();
      e.stopPropagation();
      moveToNextField(activeElement);
    },
    [moveToNextField]
  );

  return {
    formRef,
    handleKeyDown,
    moveToNextField,
    fieldOrder: explicitFieldOrder ?? PATIENT_REGISTRATION_FIELD_ORDER
  };
}
