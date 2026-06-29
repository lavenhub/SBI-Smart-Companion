/** Generate a unique transaction reference ID */
export declare function generateReferenceId(prefix?: string): string;
/** Generate masked account/card number */
export declare function maskAccountNumber(num: string, visibleLast?: number): string;
export declare function maskCardNumber(num: string): string;
/** Generate a padded account number */
export declare function generateAccountNumber(prefix?: string): string;
/** Generate loan/FD/RD account number */
export declare function generateLoanAccountNumber(type: string): string;
/** SHA-256 hash */
export declare function sha256(data: string): string;
/** Compute file checksum */
export declare function computeChecksum(buffer: Buffer): string;
/** Normalise a search query */
export declare function normalizeQuery(query: string): string;
/** Calculate estimated completion percentage */
export declare function calcCompletionPercent(completedFields: string[], allFields: string[]): number;
/** Days until a date */
export declare function daysUntil(date: Date): number;
/** Current financial year string */
export declare function currentFinancialYear(): string;
/** Sanitise filename for storage */
export declare function sanitizeFilename(name: string): string;
/** Simple fuzzy score between query and target (0–1) */
export declare function fuzzyScore(query: string, target: string): number;
/** Generate OTP */
export declare function generateOtp(length?: number): string;
/** Detect transaction category from description */
export declare function detectCategory(description: string): string;
//# sourceMappingURL=helpers.d.ts.map