/**
 * Doctor name normalization and formatting utilities.
 * Eliminates redundant doctor title prefixes like "Dr. Dr. Nilesh Mahale".
 */

/**
 * Normalizes and formats doctor titles and names, preventing duplicate prefixes
 * like "Dr. Dr. Nilesh Mahale" or "Dr. Dr Nilesh Mahale".
 *
 * @param title Optional title prefix such as "Dr.", "Prof.", "Dr"
 * @param name The doctor's name string, which might already contain "Dr."
 * @returns Cleanly formatted doctor name with exactly one title prefix
 */
export function formatDoctorName(title?: string | null, name?: string | null): string {
  if (!name && !title) return '';
  const rawName = (name || '').trim();
  const rawTitle = (title || '').trim();

  if (!rawName) return rawTitle;

  // Strip any existing repeated "Dr." or "Dr" prefixes (case-insensitive)
  const cleaned = rawName.replace(/^(?:dr\.?\s+)+/i, '').trim();
  const effectiveTitle = rawTitle || 'Dr.';

  return `${effectiveTitle} ${cleaned}`.trim();
}

/**
 * Strips title prefixes from a doctor name, returning just the clean name.
 */
export function stripDoctorPrefix(name?: string | null): string {
  if (!name) return '';
  return name.replace(/^(?:dr\.?\s+)+/i, '').trim();
}

