"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferenceId = generateReferenceId;
exports.maskAccountNumber = maskAccountNumber;
exports.maskCardNumber = maskCardNumber;
exports.generateAccountNumber = generateAccountNumber;
exports.generateLoanAccountNumber = generateLoanAccountNumber;
exports.sha256 = sha256;
exports.computeChecksum = computeChecksum;
exports.normalizeQuery = normalizeQuery;
exports.calcCompletionPercent = calcCompletionPercent;
exports.daysUntil = daysUntil;
exports.currentFinancialYear = currentFinancialYear;
exports.sanitizeFilename = sanitizeFilename;
exports.fuzzyScore = fuzzyScore;
exports.generateOtp = generateOtp;
exports.detectCategory = detectCategory;
const crypto_1 = __importDefault(require("crypto"));
/** Generate a unique transaction reference ID */
function generateReferenceId(prefix = 'TXN') {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}${ts}${rand}`;
}
/** Generate masked account/card number */
function maskAccountNumber(num, visibleLast = 4) {
    if (num.length <= visibleLast)
        return num;
    return 'X'.repeat(num.length - visibleLast) + num.slice(-visibleLast);
}
function maskCardNumber(num) {
    const clean = num.replace(/\s/g, '');
    return `${clean.slice(0, 4)} XXXX XXXX ${clean.slice(-4)}`;
}
/** Generate a padded account number */
function generateAccountNumber(prefix = '3') {
    const rand = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
    return `${prefix}${rand}`.slice(0, 16);
}
/** Generate loan/FD/RD account number */
function generateLoanAccountNumber(type) {
    const code = {
        HOME: 'HL', CAR: 'CL', PERSONAL: 'PL', EDUCATION: 'EL',
        GOLD: 'GL', BUSINESS: 'BL', OVERDRAFT: 'OD',
    };
    const prefix = code[type] ?? 'LN';
    return `${prefix}${Date.now().toString().slice(-10)}`;
}
/** SHA-256 hash */
function sha256(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
/** Compute file checksum */
function computeChecksum(buffer) {
    return crypto_1.default.createHash('sha256').update(buffer).digest('hex');
}
/** Normalise a search query */
function normalizeQuery(query) {
    return query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
/** Calculate estimated completion percentage */
function calcCompletionPercent(completedFields, allFields) {
    if (allFields.length === 0)
        return 100;
    return Math.round((completedFields.length / allFields.length) * 100);
}
/** Days until a date */
function daysUntil(date) {
    const diffMs = date.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
/** Current financial year string */
function currentFinancialYear() {
    const now = new Date();
    const yr = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `FY${yr}-${String(yr + 1).slice(-2)}`;
}
/** Sanitise filename for storage */
function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
}
/** Simple fuzzy score between query and target (0–1) */
function fuzzyScore(query, target) {
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (t === q)
        return 1;
    if (t.startsWith(q))
        return 0.9;
    if (t.includes(q))
        return 0.7;
    // character overlap ratio
    let matches = 0;
    for (const ch of q)
        if (t.includes(ch))
            matches++;
    return matches / Math.max(q.length, t.length);
}
/** Generate OTP */
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    const bytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += digits[bytes[i] % 10];
    }
    return otp;
}
/** Detect transaction category from description */
function detectCategory(description) {
    const d = description.toLowerCase();
    if (d.includes('salary') || d.includes('infosys') || d.includes('tcs'))
        return 'Income';
    if (d.includes('zomato') || d.includes('swiggy') || d.includes('food'))
        return 'Food';
    if (d.includes('amazon') || d.includes('flipkart') || d.includes('myntra'))
        return 'Shopping';
    if (d.includes('ola') || d.includes('uber') || d.includes('fuel'))
        return 'Travel';
    if (d.includes('emi') || d.includes('loan'))
        return 'Loan EMI';
    if (d.includes('sip') || d.includes('mutual fund') || d.includes('fd'))
        return 'Investment';
    if (d.includes('netflix') || d.includes('spotify') || d.includes('prime'))
        return 'Entertainment';
    if (d.includes('electricity') || d.includes('water') || d.includes('internet'))
        return 'Utilities';
    if (d.includes('rent'))
        return 'Housing';
    if (d.includes('insurance'))
        return 'Insurance';
    return 'Others';
}
//# sourceMappingURL=helpers.js.map