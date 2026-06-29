"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// YONO Smart Companion — Seed (SQLite-compatible)
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const constants_1 = require("../constants");
const seedSearchIndex_1 = require("./seedSearchIndex");
const prisma = new client_1.PrismaClient();
const J = JSON.stringify; // helper — SQLite stores arrays/objects as JSON strings
async function cleanup() {
    const models = [
        'auditLog', 'notification', 'recentActivity', 'quickAction',
        'dashboardPreference', 'searchHistory', 'applicationDraft', 'application',
        'rewardPoint', 'warranty', 'invoice', 'receipt', 'purchaseHistory',
        'transaction', 'emiSchedule', 'loan', 'fixedDeposit', 'recurringDeposit',
        'insurancePolicy', 'bill', 'document', 'vaultFolder', 'card', 'beneficiary',
        'account', 'refreshToken', 'session', 'userDevice', 'otpRecord', 'user',
        'merchant', 'merchantCategory',
    ];
    for (const m of models)
        await prisma[m].deleteMany();
}
async function seedMerchants() {
    const food = await prisma.merchantCategory.create({ data: { name: 'Food & Dining', code: 'FOOD', icon: 'utensils' } });
    const shop = await prisma.merchantCategory.create({ data: { name: 'Shopping', code: 'SHOP', icon: 'shopping-bag' } });
    const trvl = await prisma.merchantCategory.create({ data: { name: 'Travel', code: 'TRVL', icon: 'plane' } });
    const util = await prisma.merchantCategory.create({ data: { name: 'Utilities', code: 'UTIL', icon: 'zap' } });
    const entr = await prisma.merchantCategory.create({ data: { name: 'Entertainment', code: 'ENTR', icon: 'film' } });
    const finc = await prisma.merchantCategory.create({ data: { name: 'Financial', code: 'FINC', icon: 'landmark' } });
    const merchants = await Promise.all([
        prisma.merchant.create({ data: { categoryId: food.id, name: 'Zomato', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: food.id, name: 'Swiggy', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: shop.id, name: 'Amazon India', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: shop.id, name: 'Flipkart', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: shop.id, name: 'Samsung India', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: trvl.id, name: 'Ola Cabs', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: trvl.id, name: 'IndiGo Airlines', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: util.id, name: 'BSES Yamuna Power', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: util.id, name: 'Airtel', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: entr.id, name: 'Netflix India', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: finc.id, name: 'SBI Mutual Fund', isVerified: true } }),
        prisma.merchant.create({ data: { categoryId: finc.id, name: 'Infosys Ltd', isVerified: true } }),
    ]);
    return Object.fromEntries(merchants.map(m => [m.name, m.id]));
}
async function seedUsers() {
    const hash = await bcrypt_1.default.hash('SBI@12345', 12);
    const u1 = await prisma.user.create({ data: {
            firstName: 'Lavish', lastName: 'Sharma', email: 'lavish.sharma@email.com',
            phone: '9876543210', passwordHash: hash, role: 'CUSTOMER', kycStatus: 'VERIFIED',
            isPhoneVerified: true, isEmailVerified: true, pan: 'ABCPS1234F',
            dateOfBirth: new Date('1995-06-15'), gender: 'Male',
            occupation: 'Software Engineer', annualIncome: 1200000,
            addressLine1: 'Flat 402, Prestige Tower', city: 'New Delhi', state: 'Delhi', pincode: '110001',
        } });
    await prisma.user.create({ data: {
            firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com',
            phone: '9876543211', passwordHash: hash, role: 'CUSTOMER', kycStatus: 'VERIFIED',
            isPhoneVerified: true, isEmailVerified: true, city: 'Mumbai', state: 'Maharashtra',
        } });
    await prisma.user.create({ data: {
            firstName: 'Admin', lastName: 'YONO', email: 'admin@yono.sbi.co.in',
            phone: '9000000001', passwordHash: hash, role: 'ADMIN', kycStatus: 'VERIFIED',
            isPhoneVerified: true, isEmailVerified: true, city: 'Mumbai', state: 'Maharashtra',
        } });
    return u1;
}
async function seedUserData(userId, merchantMap) {
    const now = new Date();
    // ── Accounts ──────────────────────────────────────────────────────────────
    const sav = await prisma.account.create({ data: {
            userId, accountNumber: '30123456789012', accountType: 'SAVINGS', status: 'ACTIVE',
            balance: 284350.75, availableBalance: 280000, minBalance: 1000, interestRate: 3.5,
            branch: 'Connaught Place, New Delhi', ifscCode: 'SBIN0001234',
            nomineeName: 'Sunita Sharma', nomineeRelation: 'Mother',
        } });
    await prisma.account.create({ data: {
            userId, accountNumber: '30198765432109', accountType: 'CURRENT', status: 'ACTIVE',
            balance: 1250000, availableBalance: 1250000, minBalance: 5000, interestRate: 0,
            branch: 'Connaught Place, New Delhi', ifscCode: 'SBIN0001234',
        } });
    // ── Cards ──────────────────────────────────────────────────────────────────
    await prisma.card.create({ data: {
            userId, accountId: sav.id, cardNumber: '4523198821001234',
            maskedNumber: '4523 XXXX XXXX 1234', cardType: 'DEBIT', network: 'VISA',
            status: 'ACTIVE', nameOnCard: 'LAVISH SHARMA', expiryMonth: 12, expiryYear: 2027,
            cvvHash: await bcrypt_1.default.hash('456', 10),
            dailyAtmLimit: 40000, dailyPosLimit: 100000,
        } });
    await prisma.card.create({ data: {
            userId, accountId: sav.id, cardNumber: '5214330133012345',
            maskedNumber: '5214 XXXX XXXX 2345', cardType: 'CREDIT', network: 'MASTERCARD',
            status: 'ACTIVE', nameOnCard: 'LAVISH SHARMA', expiryMonth: 8, expiryYear: 2028,
            cvvHash: await bcrypt_1.default.hash('789', 10),
            creditLimit: 500000, availableCredit: 412570, cashLimit: 100000,
            dailyAtmLimit: 20000, dailyPosLimit: 500000,
        } });
    // ── Beneficiaries ──────────────────────────────────────────────────────────
    await prisma.beneficiary.createMany({ data: [
            { userId, name: 'Priya Sharma', bankName: 'HDFC Bank', accountNumber: '50100123456789', ifscCode: 'HDFC0001234', upiId: 'priya@hdfc', isFavorite: true },
            { userId, name: 'Rahul Verma', bankName: 'ICICI Bank', accountNumber: '123456789012', ifscCode: 'ICIC0001234', upiId: 'rahul@icici', isFavorite: true },
            { userId, name: 'Mom', bankName: 'SBI', accountNumber: '30198765432100', ifscCode: 'SBIN0001234', upiId: 'mom@sbi', isFavorite: true },
            { userId, name: 'Vikram Singh', bankName: 'Axis Bank', accountNumber: '918010056789', ifscCode: 'UTIB0001234', upiId: 'vikram@axis', isFavorite: false },
        ] });
    console.log('✓ Accounts, cards, beneficiaries');
    return sav;
}
async function seedFinancialProducts(userId, savId) {
    const now = new Date();
    // ── Loans ──────────────────────────────────────────────────────────────────
    const homeLoan = await prisma.loan.create({ data: {
            userId, loanAccountNumber: 'HL202401234567', loanType: 'HOME', status: 'ACTIVE',
            principalAmount: 5000000, outstandingAmount: 4234500, disbursedAmount: 5000000,
            interestRate: 8.5, processingFee: 15000, emi: 44250, tenure: 240, remainingTenure: 192,
            emiDay: 5, nextEmiDate: new Date(now.getTime() + 15 * 86400000),
            disbursedAt: new Date('2024-01-15'),
            propertyAddress: 'Flat 402, Prestige Tower, New Delhi',
        } });
    await prisma.loan.create({ data: {
            userId, loanAccountNumber: 'CL202312345678', loanType: 'CAR', status: 'ACTIVE',
            principalAmount: 800000, outstandingAmount: 520000, disbursedAmount: 800000,
            interestRate: 9.2, emi: 15800, tenure: 60, remainingTenure: 35,
            emiDay: 5, nextEmiDate: new Date(now.getTime() + 15 * 86400000),
            disbursedAt: new Date('2023-12-01'), vehicleNumber: 'DL01AB1234',
        } });
    for (let i = 1; i <= 6; i++) {
        const d = new Date('2024-01-05');
        d.setMonth(d.getMonth() + i - 1);
        await prisma.emiSchedule.create({ data: {
                loanId: homeLoan.id, installmentNo: i, dueDate: d,
                principal: 9200 + i * 50, interest: 35050 - i * 50, totalEmi: 44250,
                paidAmount: i <= 5 ? 44250 : 0, paidAt: i <= 5 ? d : null, status: i <= 5 ? 'PAID' : 'PENDING',
            } });
    }
    // ── FDs & RD ──────────────────────────────────────────────────────────────
    await prisma.fixedDeposit.createMany({ data: [
            { userId, fdAccountNumber: 'FD20240601001', principal: 200000, interestRate: 7.1, tenureDays: 365, maturityAmount: 214200, maturityDate: new Date('2025-06-01'), status: 'ACTIVE', nomineeName: 'Sunita Sharma', startDate: new Date('2024-06-01') },
            { userId, fdAccountNumber: 'FD20240315002', principal: 500000, interestRate: 7.25, tenureDays: 730, maturityAmount: 576250, maturityDate: new Date('2026-03-15'), status: 'ACTIVE', isTaxSaver: true, nomineeName: 'Sunita Sharma', startDate: new Date('2024-03-15') },
        ] });
    await prisma.recurringDeposit.create({ data: {
            userId, rdAccountNumber: 'RD20240201001', monthlyInstallment: 10000,
            interestRate: 6.8, tenureMonths: 24, completedMonths: 8, maturityAmount: 258240,
            maturityDate: new Date('2026-02-01'), status: 'ACTIVE', startDate: new Date('2024-02-01'),
        } });
    // ── Insurance ──────────────────────────────────────────────────────────────
    await prisma.insurancePolicy.createMany({ data: [
            { userId, policyNumber: 'LIC245678901', insuranceType: 'LIFE', status: 'ACTIVE', provider: 'LIC of India', productName: 'LIC Jeevan Anand', sumAssured: 10000000, premium: 28000, premiumFrequency: 'ANNUAL', nextDueDate: new Date('2025-04-01'), maturityDate: new Date('2040-04-01'), startDate: new Date('2020-04-01'), coverageDetails: J({ type: 'Whole Life' }) },
            { userId, policyNumber: 'SBIGH2023456789', insuranceType: 'HEALTH', status: 'ACTIVE', provider: 'SBI General Insurance', productName: 'SBI Arogya Premier', sumAssured: 500000, premium: 12500, premiumFrequency: 'ANNUAL', nextDueDate: new Date('2025-07-15'), startDate: new Date('2023-07-15'), coverageDetails: J({ type: 'Family Floater', members: 4 }) },
            { userId, policyNumber: 'SBIGV2024112233', insuranceType: 'VEHICLE', status: 'ACTIVE', provider: 'SBI General Insurance', productName: 'SBI Comprehensive Motor', sumAssured: 800000, premium: 18500, premiumFrequency: 'ANNUAL', nextDueDate: new Date('2025-01-20'), startDate: new Date('2024-01-20'), coverageDetails: J({ vehicle: 'Honda City' }) },
        ] });
    // ── Bills ──────────────────────────────────────────────────────────────────
    await prisma.bill.createMany({ data: [
            { userId, name: 'BSES Electricity', amount: 4200, dueDate: new Date(now.getTime() + 3 * 86400000), category: 'Utility', status: 'PENDING', isRecurring: true, recurrenceDays: 30 },
            { userId, name: 'Airtel Broadband', amount: 999, dueDate: new Date(now.getTime() + 5 * 86400000), category: 'Utility', status: 'PENDING', isRecurring: true, recurrenceDays: 30 },
            { userId, name: 'Netflix + Prime', amount: 1498, dueDate: new Date(now.getTime() + 8 * 86400000), category: 'Entertainment', status: 'PENDING', isRecurring: true, recurrenceDays: 30 },
            { userId, name: 'Home Loan EMI', amount: 44250, dueDate: new Date(now.getTime() + 15 * 86400000), category: 'Loan', status: 'PENDING', isRecurring: true, recurrenceDays: 30 },
            { userId, name: 'Car Loan EMI', amount: 15800, dueDate: new Date(now.getTime() + 15 * 86400000), category: 'Loan', status: 'PENDING', isRecurring: true, recurrenceDays: 30 },
            { userId, name: 'LIC Premium', amount: 28000, dueDate: new Date(now.getTime() + 30 * 86400000), category: 'Insurance', status: 'PENDING', isRecurring: true, recurrenceDays: 365 },
        ] });
    console.log('✓ Loans, FDs, Insurance, Bills');
}
async function seedVaultAndDocs(userId) {
    const folderIds = {};
    for (let i = 0; i < constants_1.SYSTEM_VAULT_FOLDERS.length; i++) {
        const f = constants_1.SYSTEM_VAULT_FOLDERS[i];
        const folder = await prisma.vaultFolder.create({ data: { userId, name: f.name, slug: f.slug, icon: f.icon, color: f.color, isSystem: true, sortOrder: i } });
        folderIds[f.slug] = folder.id;
    }
    const buyFolder = await prisma.vaultFolder.create({ data: { userId, name: 'Samsung TV — Purchase', slug: 'samsung-tv-purchase', parentId: folderIds.receipts, isSystem: false, icon: 'tv', color: '#0099cc', sortOrder: 0 } });
    await prisma.document.createMany({ data: [
            { userId, folderId: folderIds.statements, name: 'Account Statement — June 2024', category: 'STATEMENT', fileName: 'statement_jun2024.pdf', fileKey: `${userId}/statements/statement_jun2024.pdf`, mimeType: 'application/pdf', fileSizeBytes: 290816, tags: J(['statement', 'june-2024']), isAutoGenerated: true },
            { userId, folderId: folderIds['fd-certificates'], name: 'FD Certificate — ₹2L', category: 'FD_CERTIFICATE', fileName: 'fd_cert_001.pdf', fileKey: `${userId}/fd/fd_cert_001.pdf`, mimeType: 'application/pdf', fileSizeBytes: 131072, tags: J(['fd', 'certificate']), isAutoGenerated: true },
            { userId, folderId: folderIds['loan-documents'], name: 'Home Loan Statement', category: 'LOAN_DOCUMENT', fileName: 'home_loan_stmt.pdf', fileKey: `${userId}/loan/home_loan_stmt.pdf`, mimeType: 'application/pdf', fileSizeBytes: 524288, tags: J(['home-loan']), isAutoGenerated: true },
            { userId, folderId: folderIds.insurance, name: 'LIC Jeevan Anand Policy', category: 'INSURANCE_POLICY', fileName: 'lic_policy.pdf', fileKey: `${userId}/insurance/lic_policy.pdf`, mimeType: 'application/pdf', fileSizeBytes: 1258291, tags: J(['lic', 'life-insurance']), isAutoGenerated: true },
            { userId, folderId: folderIds['tax-documents'], name: 'Form 26AS — FY 2023-24', category: 'TAX_DOCUMENT', fileName: 'form26as_2324.pdf', fileKey: `${userId}/tax/form26as_2324.pdf`, mimeType: 'application/pdf', fileSizeBytes: 348160, tags: J(['tax', 'form-26as']), isAutoGenerated: true },
            { userId, folderId: buyFolder.id, name: 'Samsung 65" TV — Invoice', category: 'INVOICE', fileName: 'samsung_tv_invoice.pdf', fileKey: `${userId}/receipts/samsung_tv_invoice.pdf`, mimeType: 'application/pdf', fileSizeBytes: 184320, tags: J(['samsung', 'tv', 'invoice']), isAutoGenerated: false, metadata: J({ amount: 72990, warranty: '2 Years', supportPhone: '1800-407-7355', returnWindow: '30 Days', serialNumber: 'SN2024051200234' }) },
        ] });
    console.log('✓ Vault folders and documents');
}
async function seedTransactions(userId, savId, merchantMap) {
    const now = new Date();
    const txns = [
        { type: 'CREDIT', mode: 'NEFT', amount: 85000, desc: 'Salary — Infosys Ltd', cat: 'Income', mName: 'Infosys Ltd', days: 1 },
        { type: 'DEBIT', mode: 'UPI', amount: 22000, desc: 'Rent — Sunshine Apartments', cat: 'Housing', mName: null, days: 2 },
        { type: 'DEBIT', mode: 'UPI', amount: 3240, desc: 'Zomato — Food Delivery', cat: 'Food', mName: 'Zomato', days: 3 },
        { type: 'DEBIT', mode: 'CARD', amount: 15499, desc: 'Amazon — Electronics', cat: 'Shopping', mName: 'Amazon India', days: 4 },
        { type: 'DEBIT', mode: 'AUTO_DEBIT', amount: 44250, desc: 'Home Loan EMI', cat: 'Loan EMI', mName: null, days: 5 },
        { type: 'DEBIT', mode: 'UPI', amount: 2199, desc: 'Ola — Cab Rides', cat: 'Travel', mName: 'Ola Cabs', days: 6 },
        { type: 'CREDIT', mode: 'INTERNAL', amount: 5000, desc: 'Cashback — SBI ELITE Card', cat: 'Rewards', mName: null, days: 7 },
        { type: 'DEBIT', mode: 'AUTO_DEBIT', amount: 5000, desc: 'SIP — SBI Blue Chip Fund', cat: 'Investment', mName: 'SBI Mutual Fund', days: 8 },
        { type: 'DEBIT', mode: 'CARD', amount: 1499, desc: 'Netflix — Subscription', cat: 'Entertainment', mName: 'Netflix India', days: 9 },
        { type: 'DEBIT', mode: 'UPI', amount: 4200, desc: 'BSES — Electricity Bill', cat: 'Utilities', mName: 'BSES Yamuna Power', days: 10 },
        { type: 'CREDIT', mode: 'NEFT', amount: 85000, desc: 'Salary — Infosys Ltd', cat: 'Income', mName: 'Infosys Ltd', days: 31 },
        { type: 'DEBIT', mode: 'UPI', amount: 22000, desc: 'Rent — Sunshine Apartments', cat: 'Housing', mName: null, days: 32 },
        { type: 'DEBIT', mode: 'UPI', amount: 2850, desc: 'Swiggy — Food Delivery', cat: 'Food', mName: 'Swiggy', days: 33 },
        { type: 'DEBIT', mode: 'CARD', amount: 12999, desc: 'Flipkart — Clothing', cat: 'Shopping', mName: 'Flipkart', days: 35 },
        { type: 'DEBIT', mode: 'UPI', amount: 9500, desc: 'IndiGo — Flight Ticket', cat: 'Travel', mName: 'IndiGo Airlines', days: 40 },
        { type: 'CREDIT', mode: 'NEFT', amount: 85000, desc: 'Salary — Infosys Ltd', cat: 'Income', mName: 'Infosys Ltd', days: 61 },
        { type: 'DEBIT', mode: 'UPI', amount: 22000, desc: 'Rent — Sunshine Apartments', cat: 'Housing', mName: null, days: 62 },
        { type: 'DEBIT', mode: 'UPI', amount: 3100, desc: 'Zomato — Food Delivery', cat: 'Food', mName: 'Zomato', days: 65 },
    ];
    let bal = 284350.75;
    for (const t of txns) {
        const createdAt = new Date(now.getTime() - t.days * 86400000);
        const bBefore = bal;
        const bAfter = t.type === 'CREDIT' ? bal + t.amount : bal - t.amount;
        bal = bAfter;
        await prisma.transaction.create({ data: {
                userId, accountId: savId,
                referenceId: `REF${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
                type: t.type, mode: t.mode, status: 'COMPLETED',
                amount: t.amount, charges: 0, tax: 0, netAmount: t.amount,
                balanceBefore: bBefore, balanceAfter: bAfter,
                description: t.desc, category: t.cat,
                merchantId: t.mName ? (merchantMap[t.mName] ?? null) : null,
                processedAt: createdAt, createdAt,
            } });
    }
    console.log('✓ Transactions');
}
async function seedDashboardAndActivity(userId) {
    await prisma.dashboardPreference.create({ data: {
            userId,
            layout: J([]),
            pinnedWidgets: J(['balance', 'transactions', 'bills', 'investments']),
            hiddenWidgets: J([]),
            quickActionIds: J(['transfer-money', 'pay-electricity-bill', 'download-statement', 'mobile-recharge']),
            showBalanceOnLoad: true,
        } });
    const qas = [
        { featureKey: 'transfer-money', label: 'Transfer Money', route: '/payments/transfer', icon: 'send', usageCount: 28 },
        { featureKey: 'pay-electricity-bill', label: 'Pay Electricity', route: '/payments/bills', icon: 'zap', usageCount: 12 },
        { featureKey: 'download-statement', label: 'Download Statement', route: '/accounts/statement', icon: 'download', usageCount: 8 },
        { featureKey: 'mobile-recharge', label: 'Mobile Recharge', route: '/payments/recharge', icon: 'smartphone', usageCount: 15 },
        { featureKey: 'check-balance', label: 'Check Balance', route: '/accounts', icon: 'wallet', usageCount: 45 },
    ];
    for (const qa of qas) {
        await prisma.quickAction.create({ data: { userId, ...qa, lastUsedAt: new Date(), isPinned: false } });
    }
    await prisma.notification.createMany({ data: [
            { userId, type: 'TRANSACTION_CREDIT', channel: 'IN_APP', title: 'Salary Credited', body: '₹85,000 credited from Infosys Ltd.', isRead: false, isSent: true, sentAt: new Date(Date.now() - 86400000) },
            { userId, type: 'EMI_DUE', channel: 'IN_APP', title: 'EMI Due in 3 Days', body: 'Home Loan EMI ₹44,250 due on 15 Jun 2024.', isRead: false, isSent: true, sentAt: new Date() },
            { userId, type: 'SECURITY_ALERT', channel: 'IN_APP', title: 'New Device Login', body: 'Account accessed from a new device.', isRead: true, isSent: true, sentAt: new Date(Date.now() - 2 * 86400000), readAt: new Date(Date.now() - 86400000) },
            { userId, type: 'SYSTEM', channel: 'IN_APP', title: 'Welcome to YONO!', body: 'Your Smart Companion is ready. Explore all features.', isRead: true, isSent: true, sentAt: new Date(Date.now() - 7 * 86400000), readAt: new Date(Date.now() - 6 * 86400000) },
        ] });
    await prisma.rewardPoint.create({ data: { userId, type: 'BONUS', points: 500, description: 'Account opening bonus', balance: 500 } });
    await prisma.rewardPoint.create({ data: { userId, type: 'EARNED', points: 12340, description: 'Accumulated card rewards', balance: 12840 } });
    console.log('✓ Dashboard, quick actions, notifications, rewards');
}
async function seedApplications(userId) {
    const now = new Date();
    const loanSteps = J([
        { index: 0, name: 'Personal Details', fields: ['firstName', 'lastName', 'dob', 'pan', 'aadhar'], isOptional: false },
        { index: 1, name: 'Employment Details', fields: ['employerName', 'employmentType', 'monthlyIncome', 'workExperience'], isOptional: false },
        { index: 2, name: 'Loan Details', fields: ['loanAmount', 'tenure', 'purpose', 'propertyAddress'], isOptional: false },
        { index: 3, name: 'Document Upload', fields: ['salarySlip', 'bankStatement', 'idProof', 'addressProof'], isOptional: false },
        { index: 4, name: 'Review & Submit', fields: ['termsAccepted'], isOptional: false },
    ]);
    const loanApp = await prisma.application.create({ data: {
            userId, applicationType: 'LOAN', status: 'DRAFT', title: 'Home Loan Application',
            currentStep: 3, totalSteps: 5, completionPercent: 82, estimatedMinutes: 8,
            formData: J({ firstName: 'Lavish', lastName: 'Sharma', employerName: 'Infosys Ltd', monthlyIncome: 100000, loanAmount: 3500000, tenure: 240 }),
            completedFields: J(['firstName', 'lastName', 'dob', 'pan', 'aadhar', 'employerName', 'employmentType', 'monthlyIncome', 'workExperience', 'loanAmount', 'tenure', 'purpose', 'propertyAddress']),
            missingFields: J(['salarySlip', 'bankStatement', 'idProof', 'addressProof', 'termsAccepted']),
            steps: loanSteps,
            expiresAt: new Date(now.getTime() + 30 * 86400000),
        } });
    await prisma.applicationDraft.create({ data: {
            applicationId: loanApp.id, stepIndex: 3, stepName: 'Document Upload',
            fieldData: J({}), version: 1, isLatest: true,
        } });
    const fdSteps = J([
        { index: 0, name: 'FD Amount', fields: ['amount', 'sourceAccountId'], isOptional: false },
        { index: 1, name: 'Tenure & Type', fields: ['tenureDays', 'fdType', 'isAutoRenew'], isOptional: false },
        { index: 2, name: 'Nominee', fields: ['nomineeName', 'nomineeRelation', 'nomineeDob'], isOptional: false },
        { index: 3, name: 'Confirm', fields: ['termsAccepted'], isOptional: false },
    ]);
    await prisma.application.create({ data: {
            userId, applicationType: 'FIXED_DEPOSIT', status: 'DRAFT', title: 'FD Creation',
            currentStep: 1, totalSteps: 4, completionPercent: 55, estimatedMinutes: 3,
            formData: J({ amount: 100000 }),
            completedFields: J(['amount', 'sourceAccountId']),
            missingFields: J(['tenureDays', 'fdType', 'isAutoRenew', 'nomineeName', 'nomineeRelation', 'termsAccepted']),
            steps: fdSteps,
            expiresAt: new Date(now.getTime() + 30 * 86400000),
        } });
    const nomineeSteps = J([
        { index: 0, name: 'Nominee Details', fields: ['nomineeName', 'nomineeRelation', 'nomineeDob', 'nomineeShare'], isOptional: false },
        { index: 1, name: 'ID Proof', fields: ['nomineeIdProof'], isOptional: false },
        { index: 2, name: 'Confirm', fields: ['otpVerified'], isOptional: false },
    ]);
    await prisma.application.create({ data: {
            userId, applicationType: 'NOMINEE_UPDATE', status: 'DRAFT', title: 'Nominee Update',
            currentStep: 2, totalSteps: 3, completionPercent: 92, estimatedMinutes: 1,
            formData: J({ nomineeName: 'Sunita Sharma', nomineeRelation: 'Mother' }),
            completedFields: J(['nomineeName', 'nomineeRelation', 'nomineeDob', 'nomineeShare', 'nomineeIdProof']),
            missingFields: J(['otpVerified']),
            steps: nomineeSteps,
            expiresAt: new Date(now.getTime() + 30 * 86400000),
        } });
    console.log('✓ Draft applications');
}
// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Seeding YONO Smart Companion (SQLite)...\n');
    await cleanup();
    console.log('✓ Cleaned existing data');
    const merchantMap = await seedMerchants();
    console.log('✓ Merchants');
    const user = await seedUsers();
    console.log('✓ Users');
    const sav = await seedUserData(user.id, merchantMap);
    await seedFinancialProducts(user.id, sav.id);
    await seedVaultAndDocs(user.id);
    await seedTransactions(user.id, sav.id, merchantMap);
    await seedDashboardAndActivity(user.id);
    await seedApplications(user.id);
    await (0, seedSearchIndex_1.seedSearchIndex)();
    console.log('✓ Search index');
    console.log('\n✅ Done! Login: lavish.sharma@email.com / SBI@12345');
}
main()
    .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map