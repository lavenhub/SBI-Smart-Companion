"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_FILE_SIZE_BYTES = exports.ALLOWED_MIME_TYPES = exports.TRANSACTION_CATEGORIES = exports.OTP_PURPOSE = exports.REWARD_RATES = exports.SYSTEM_VAULT_FOLDERS = exports.APPLICATION_STEPS = exports.TRANSACTION = exports.CACHE_TTL = exports.CACHE_KEYS = exports.HTTP_STATUS = void 0;
// ─── HTTP Status Codes ────────────────────────────────────────────────────────
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
};
// ─── Cache Keys ───────────────────────────────────────────────────────────────
exports.CACHE_KEYS = {
    USER_PROFILE: (userId) => `user:profile:${userId}`,
    USER_ACCOUNTS: (userId) => `user:accounts:${userId}`,
    USER_DASHBOARD: (userId) => `user:dashboard:${userId}`,
    USER_NOTIFICATIONS: (userId) => `user:notifications:${userId}`,
    USER_REWARD_BALANCE: (userId) => `user:rewards:${userId}`,
    SEARCH_INDEX: 'search:index:all',
    SEARCH_POPULAR: 'search:popular',
    VAULT_FOLDERS: (userId) => `vault:folders:${userId}`,
    DASHBOARD_PREFS: (userId) => `dashboard:prefs:${userId}`,
    QUICK_ACTIONS: (userId) => `quick:actions:${userId}`,
    REFRESH_TOKEN: (tokenId) => `rt:${tokenId}`,
    OTP: (identifier, purpose) => `otp:${identifier}:${purpose}`,
};
exports.CACHE_TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    VERY_LONG: 86400,
    USER_PROFILE: 300,
    ACCOUNTS: 60,
    DASHBOARD: 30,
    SEARCH_INDEX: 3600,
    NOTIFICATIONS: 60,
};
// ─── Transaction Constants ────────────────────────────────────────────────────
exports.TRANSACTION = {
    MIN_AMOUNT: 1,
    MAX_UPI_AMOUNT: 100000,
    MAX_NEFT_AMOUNT: 50000000,
    MAX_RTGS_AMOUNT: 50000000,
    MIN_RTGS_AMOUNT: 200000,
    MAX_IMPS_AMOUNT: 500000,
    DAILY_UPI_LIMIT: 100000,
    UPI_FEE_THRESHOLD: 1000,
    IMPS_FEE_RATE: 0.001,
    NEFT_FEE_SLAB: [
        { max: 10000, fee: 2.5 },
        { max: 100000, fee: 5 },
        { max: 200000, fee: 15 },
        { max: Infinity, fee: 25 },
    ],
};
// ─── Application Steps ────────────────────────────────────────────────────────
exports.APPLICATION_STEPS = {
    LOAN: [
        { name: 'Personal Details', fields: ['firstName', 'lastName', 'dob', 'pan', 'aadhar'] },
        { name: 'Employment Details', fields: ['employerName', 'employmentType', 'monthlyIncome', 'workExperience'] },
        { name: 'Loan Details', fields: ['loanAmount', 'tenure', 'purpose', 'propertyAddress'] },
        { name: 'Document Upload', fields: ['salarySlip', 'bankStatement', 'idProof', 'addressProof'] },
        { name: 'Review & Submit', fields: ['termsAccepted', 'declarationAccepted'] },
    ],
    CREDIT_CARD: [
        { name: 'Basic Information', fields: ['firstName', 'lastName', 'dob', 'pan'] },
        { name: 'Employment Details', fields: ['employerName', 'employmentType', 'annualIncome'] },
        { name: 'Card Preferences', fields: ['cardVariant', 'deliveryAddress'] },
        { name: 'Document Upload', fields: ['salarySlip', 'idProof'] },
        { name: 'Review & Submit', fields: ['termsAccepted'] },
    ],
    FIXED_DEPOSIT: [
        { name: 'FD Amount', fields: ['amount', 'sourceAccountId'] },
        { name: 'Tenure & Type', fields: ['tenureDays', 'fdType', 'isAutoRenew'] },
        { name: 'Nominee Details', fields: ['nomineeName', 'nomineeRelation', 'nomineeDob'] },
        { name: 'Confirm', fields: ['termsAccepted'] },
    ],
    INSURANCE: [
        { name: 'Insurance Type', fields: ['insuranceType', 'provider'] },
        { name: 'Personal Details', fields: ['firstName', 'lastName', 'dob', 'gender', 'occupation'] },
        { name: 'Coverage Details', fields: ['sumAssured', 'premiumFrequency'] },
        { name: 'Nominee Details', fields: ['nomineeName', 'nomineeRelation'] },
        { name: 'Document Upload', fields: ['idProof', 'medicalReport'] },
        { name: 'Review & Submit', fields: ['termsAccepted'] },
    ],
    NOMINEE_UPDATE: [
        { name: 'Nominee Details', fields: ['nomineeName', 'nomineeRelation', 'nomineeDob', 'nomineeShare'] },
        { name: 'ID Proof Upload', fields: ['nomineeIdProof'] },
        { name: 'Confirm', fields: ['otpVerified'] },
    ],
    ADDRESS_UPDATE: [
        { name: 'New Address', fields: ['addressLine1', 'addressLine2', 'city', 'state', 'pincode'] },
        { name: 'Address Proof', fields: ['addressProof'] },
        { name: 'Confirm', fields: ['otpVerified'] },
    ],
    KYC_UPDATE: [
        { name: 'Identity Proof', fields: ['idType', 'idNumber', 'idProof'] },
        { name: 'Address Proof', fields: ['addressType', 'addressProof'] },
        { name: 'Selfie Verification', fields: ['selfie'] },
        { name: 'Confirm', fields: ['otpVerified'] },
    ],
};
// ─── Vault System Folders ─────────────────────────────────────────────────────
exports.SYSTEM_VAULT_FOLDERS = [
    { name: 'Statements', slug: 'statements', icon: 'file-bar-chart', color: '#003399' },
    { name: 'Loan Documents', slug: 'loan-documents', icon: 'file-text', color: '#f59e0b' },
    { name: 'FD Certificates', slug: 'fd-certificates', icon: 'landmark', color: '#0099cc' },
    { name: 'Insurance', slug: 'insurance', icon: 'shield', color: '#10b981' },
    { name: 'Tax Documents', slug: 'tax-documents', icon: 'receipt', color: '#8b5cf6' },
    { name: 'Receipts', slug: 'receipts', icon: 'shopping-bag', color: '#ec4899' },
    { name: 'GST Bills', slug: 'gst-bills', icon: 'credit-card', color: '#06b6d4' },
    { name: 'KYC Documents', slug: 'kyc-documents', icon: 'user-check', color: '#64748b' },
];
// ─── Reward Point Rates ───────────────────────────────────────────────────────
exports.REWARD_RATES = {
    UPI_TRANSACTION: 0,
    CARD_TRANSACTION_PER_100: 2,
    ONLINE_TRANSACTION_PER_100: 3,
    TRAVEL_TRANSACTION_PER_100: 5,
    FIRST_TRANSACTION_BONUS: 100,
    ACCOUNT_OPENING_BONUS: 500,
};
// ─── OTP Purposes ─────────────────────────────────────────────────────────────
exports.OTP_PURPOSE = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    TRANSACTION: 'TRANSACTION',
    CHANGE_MPIN: 'CHANGE_MPIN',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
    KYC: 'KYC',
    ADDRESS_UPDATE: 'ADDRESS_UPDATE',
    NOMINEE_UPDATE: 'NOMINEE_UPDATE',
};
// ─── Transaction Categories ───────────────────────────────────────────────────
exports.TRANSACTION_CATEGORIES = {
    Income: ['SALARY', 'INTEREST', 'DIVIDEND', 'BONUS', 'REFUND', 'CASHBACK'],
    Food: ['RESTAURANT', 'FOOD_DELIVERY', 'GROCERIES', 'SUPERMARKET'],
    Shopping: ['ECOMMERCE', 'RETAIL', 'CLOTHING', 'ELECTRONICS'],
    Travel: ['FUEL', 'TRANSPORT', 'RIDE_SHARING', 'RAILWAYS', 'AIRWAYS'],
    Housing: ['RENT', 'MAINTENANCE', 'UTILITIES'],
    'Loan EMI': ['LOAN_EMI', 'CREDIT_CARD_BILL'],
    Investment: ['SIP', 'FD', 'RD', 'STOCKS'],
    Insurance: ['INSURANCE_PREMIUM'],
    Entertainment: ['OTT', 'MOVIES', 'GAMING'],
    Healthcare: ['HOSPITAL', 'PHARMACY', 'CLINIC'],
    Utilities: ['ELECTRICITY', 'WATER', 'GAS', 'INTERNET', 'MOBILE_RECHARGE'],
};
// ─── File Upload ──────────────────────────────────────────────────────────────
exports.ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
exports.MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
//# sourceMappingURL=index.js.map