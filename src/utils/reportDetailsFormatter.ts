/**
 * Report Details Formatter & Bullet Parser Utility
 * Converts plain text, multi-line, or existing formatted report descriptions into
 * structured, beautifully aligned bullet items for professional document preview and printing.
 */

export interface ReportDetailBulletItem {
  id: string;
  bulletText: string;
  label?: string;
  content: string;
  isImpression?: boolean;
}

export interface ParsedReportDetails {
  items: ReportDetailBulletItem[];
  impressionTitle?: string;
  impressionLines: string[];
  rawText: string;
}

const IMPRESSION_REGEX = /^(IMPRESSION|CONCLUSION|COMMENTS|RECOMMENDATION|RECOMMENDATIONS|REMARKS?|OPINION)\s*[:\-]\s*(.*)$/i;
const BULLET_PREFIX_REGEX = /^[\s\t]*([•\-\*–—\u2022\u25CF\u25BA]|\d+[\.\)])\s*/;
const COLON_PREFIX_REGEX = /^([A-Z0-9\s&/()_\-+]{2,35})\s*:\s*(.*)$/;

/**
 * Parses raw report details text into structured bullet items and impression blocks.
 * Safely preserves all original entered text without loss of clinical information.
 */
export function parseReportDetails(rawDetails?: string): ParsedReportDetails {
  if (!rawDetails || !rawDetails.trim()) {
    return {
      items: [],
      impressionLines: [],
      rawText: ''
    };
  }

  const normalized = rawDetails.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');

  const items: ReportDetailBulletItem[] = [];
  const impressionLines: string[] = [];
  let impressionTitle: string | undefined = undefined;
  let inImpressionSection = false;

  rawLines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return; // Skip empty lines for bullet list, preserving natural grouping
    }

    // Check if this line starts an Impression / Conclusion section
    const impressionMatch = trimmed.match(IMPRESSION_REGEX);
    if (impressionMatch) {
      inImpressionSection = true;
      impressionTitle = impressionMatch[1].toUpperCase();
      const content = impressionMatch[2].trim();
      if (content) {
        impressionLines.push(content);
      }
      return;
    }

    if (inImpressionSection) {
      // Clean leading bullet markers if already present in impression lines
      const cleanLine = trimmed.replace(BULLET_PREFIX_REGEX, '').trim();
      if (cleanLine) {
        impressionLines.push(cleanLine);
      }
      return;
    }

    // Strip existing bullet markers (e.g. •, -, *, 1.) to normalize bullet rendering
    const cleanLine = trimmed.replace(BULLET_PREFIX_REGEX, '').trim();
    if (!cleanLine) return;

    // Check if line has a bold header prefix like "LIVER: Normal in size..." or "HAEMOGLOBIN: 14.2 g/dL"
    const colonMatch = cleanLine.match(COLON_PREFIX_REGEX);
    if (colonMatch && colonMatch[1].length < 35) {
      const label = colonMatch[1].trim() + ':';
      const content = colonMatch[2].trim();
      items.push({
        id: `bullet-${index}-${Date.now()}`,
        bulletText: cleanLine,
        label,
        content: content || cleanLine
      });
    } else {
      items.push({
        id: `bullet-${index}-${Date.now()}`,
        bulletText: cleanLine,
        content: cleanLine
      });
    }
  });

  return {
    items,
    impressionTitle,
    impressionLines,
    rawText: rawDetails
  };
}

/**
 * Auto-formats plain text into bullet lines (prefixed with "• ")
 * Preserves paragraph breaks and headers.
 */
export function autoFormatToBullets(text: string): string {
  if (!text) return '';
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    // Skip formatting if it's an impression header or already has a bullet
    if (IMPRESSION_REGEX.test(trimmed)) {
      return trimmed;
    }
    if (BULLET_PREFIX_REGEX.test(trimmed)) {
      return trimmed; // already formatted
    }
    return `• ${trimmed}`;
  });

  return formatted.join('\n');
}
