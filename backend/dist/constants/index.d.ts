export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const CACHE_KEYS: {
    readonly USER_PROFILE: (userId: string) => string;
    readonly USER_ACCOUNTS: (userId: string) => string;
    readonly USER_DASHBOARD: (userId: string) => string;
    readonly USER_NOTIFICATIONS: (userId: string) => string;
    readonly USER_REWARD_BALANCE: (userId: string) => string;
    readonly SEARCH_INDEX: "search:index:all";
    readonly SEARCH_POPULAR: "search:popular";
    readonly VAULT_FOLDERS: (userId: string) => string;
    readonly DASHBOARD_PREFS: (userId: string) => string;
    readonly QUICK_ACTIONS: (userId: string) => string;
    readonly REFRESH_TOKEN: (tokenId: string) => string;
    readonly OTP: (identifier: string, purpose: string) => string;
};
export declare const CACHE_TTL: {
    readonly SHORT: 60;
    readonly MEDIUM: 300;
    readonly LONG: 3600;
    readonly VERY_LONG: 86400;
    readonly USER_PROFILE: 300;
    readonly ACCOUNTS: 60;
    readonly DASHBOARD: 30;
    readonly SEARCH_INDEX: 3600;
    readonly NOTIFICATIONS: 60;
};
export declare const TRANSACTION: {
    readonly MIN_AMOUNT: 1;
    readonly MAX_UPI_AMOUNT: 100000;
    readonly MAX_NEFT_AMOUNT: 50000000;
    readonly MAX_RTGS_AMOUNT: 50000000;
    readonly MIN_RTGS_AMOUNT: 200000;
    readonly MAX_IMPS_AMOUNT: 500000;
    readonly DAILY_UPI_LIMIT: 100000;
    readonly UPI_FEE_THRESHOLD: 1000;
    readonly IMPS_FEE_RATE: 0.001;
    readonly NEFT_FEE_SLAB: readonly [{
        readonly max: 10000;
        readonly fee: 2.5;
    }, {
        readonly max: 100000;
        readonly fee: 5;
    }, {
        readonly max: 200000;
        readonly fee: 15;
    }, {
        readonly max: number;
        readonly fee: 25;
    }];
};
export declare const APPLICATION_STEPS: Record<string, {
    name: string;
    fields: string[];
}[]>;
export declare const SYSTEM_VAULT_FOLDERS: readonly [{
    readonly name: "Statements";
    readonly slug: "statements";
    readonly icon: "file-bar-chart";
    readonly color: "#003399";
}, {
    readonly name: "Loan Documents";
    readonly slug: "loan-documents";
    readonly icon: "file-text";
    readonly color: "#f59e0b";
}, {
    readonly name: "FD Certificates";
    readonly slug: "fd-certificates";
    readonly icon: "landmark";
    readonly color: "#0099cc";
}, {
    readonly name: "Insurance";
    readonly slug: "insurance";
    readonly icon: "shield";
    readonly color: "#10b981";
}, {
    readonly name: "Tax Documents";
    readonly slug: "tax-documents";
    readonly icon: "receipt";
    readonly color: "#8b5cf6";
}, {
    readonly name: "Receipts";
    readonly slug: "receipts";
    readonly icon: "shopping-bag";
    readonly color: "#ec4899";
}, {
    readonly name: "GST Bills";
    readonly slug: "gst-bills";
    readonly icon: "credit-card";
    readonly color: "#06b6d4";
}, {
    readonly name: "KYC Documents";
    readonly slug: "kyc-documents";
    readonly icon: "user-check";
    readonly color: "#64748b";
}];
export declare const REWARD_RATES: {
    readonly UPI_TRANSACTION: 0;
    readonly CARD_TRANSACTION_PER_100: 2;
    readonly ONLINE_TRANSACTION_PER_100: 3;
    readonly TRAVEL_TRANSACTION_PER_100: 5;
    readonly FIRST_TRANSACTION_BONUS: 100;
    readonly ACCOUNT_OPENING_BONUS: 500;
};
export declare const OTP_PURPOSE: {
    readonly LOGIN: "LOGIN";
    readonly REGISTER: "REGISTER";
    readonly TRANSACTION: "TRANSACTION";
    readonly CHANGE_MPIN: "CHANGE_MPIN";
    readonly CHANGE_PASSWORD: "CHANGE_PASSWORD";
    readonly KYC: "KYC";
    readonly ADDRESS_UPDATE: "ADDRESS_UPDATE";
    readonly NOMINEE_UPDATE: "NOMINEE_UPDATE";
};
export declare const TRANSACTION_CATEGORIES: Record<string, string[]>;
export declare const ALLOWED_MIME_TYPES: readonly ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export declare const MAX_FILE_SIZE_BYTES: number;
//# sourceMappingURL=index.d.ts.map