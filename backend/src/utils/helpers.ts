import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/** Generate a unique transaction reference ID */
export function generateReferenceId(prefix = 'TXN'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${ts}${rand}`;
}

/** Generate masked account/card number */
export function maskAccountNumber(num: string, visibleLast = 4): string {
  if (num.length <= visibleLast) return num;
  return 'X'.repeat(num.length - visibleLast) + num.slice(-visibleLast);
}

export function maskCardNumber(num: string): string {
  const clean = num.replace(/\s/g, '');
  return `${clean.slice(0, 4)} XXXX XXXX ${clean.slice(-4)}`;
}

/** Generate a padded account number */
export function generateAccountNumber(prefix = '3'): string {
  const rand = Math.floor(Math.random() * 1_000_000_000_000_000).toString().padStart(15, '0');
  return `${prefix}${rand}`.slice(0, 16);
}

/** Generate loan/FD/RD account number */
export function generateLoanAccountNumber(type: string): string {
  const code: Record<string, string> = {
    HOME: 'HL', CAR: 'CL', PERSONAL: 'PL', EDUCATION: 'EL',
    GOLD: 'GL', BUSINESS: 'BL', OVERDRAFT: 'OD',
  };
  const prefix = code[type] ?? 'LN';
  return `${prefix}${Date.now().toString().slice(-10)}`;
}

/** SHA-256 hash */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/** Compute file checksum */
export function computeChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/** Normalise a search query */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Calculate estimated completion percentage */
export function calcCompletionPercent(
  completedFields: string[],
  allFields: string[],
): number {
  if (allFields.length === 0) return 100;
  return Math.round((completedFields.length / allFields.length) * 100);
}

/** Days until a date */
export function daysUntil(date: Date): number {
  const diffMs = date.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Current financial year string */
export function currentFinancialYear(): string {
  const now = new Date();
  const yr = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `FY${yr}-${String(yr + 1).slice(-2)}`;
}

/** Sanitise filename for storage */
export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}

/** Simple fuzzy score between query and target (0–1) */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t === q) return 1;
  if (t.startsWith(q)) return 0.9;
  if (t.includes(q)) return 0.7;
  // character overlap ratio
  let matches = 0;
  for (const ch of q) if (t.includes(ch)) matches++;
  return matches / Math.max(q.length, t.length);
}

/** Generate OTP */
export function generateOtp(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
}

/** Detect transaction category from description */
export function detectCategory(description: string): string {
  const d = description.toLowerCase();
  if (d.includes('salary') || d.includes('infosys') || d.includes('tcs')) return 'Income';
  if (d.includes('zomato') || d.includes('swiggy') || d.includes('food')) return 'Food';
  if (d.includes('amazon') || d.includes('flipkart') || d.includes('myntra')) return 'Shopping';
  if (d.includes('ola') || d.includes('uber') || d.includes('fuel')) return 'Travel';
  if (d.includes('emi') || d.includes('loan')) return 'Loan EMI';
  if (d.includes('sip') || d.includes('mutual fund') || d.includes('fd')) return 'Investment';
  if (d.includes('netflix') || d.includes('spotify') || d.includes('prime')) return 'Entertainment';
  if (d.includes('electricity') || d.includes('water') || d.includes('internet')) return 'Utilities';
  if (d.includes('rent')) return 'Housing';
  if (d.includes('insurance')) return 'Insurance';
  return 'Others';
}
