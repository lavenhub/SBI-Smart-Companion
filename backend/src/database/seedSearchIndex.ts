import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const SEARCH_INDEX_DATA = [
  { featureKey: 'block-debit-card', title: 'Block Debit Card', description: 'Temporarily block or permanently hotlist your debit card', category: 'Cards', module: 'Cards', route: '/cards/block', icon: 'shield-off', keywords: ['block card', 'freeze card', 'hotlist', 'lost card', 'stolen card'], aliases: ['deactivate debit card', 'stop debit card'], synonyms: ['freeze debit card'], estimatedTime: '30 sec', shortcut: '⌘B', popularity: 850 },
  { featureKey: 'unblock-debit-card', title: 'Unblock Debit Card', description: 'Re-activate your blocked debit card', category: 'Cards', module: 'Cards', route: '/cards/unblock', icon: 'shield', keywords: ['unblock card', 'activate card', 'enable card'], aliases: ['reactivate debit card'], synonyms: [], estimatedTime: '30 sec', shortcut: null, popularity: 320 },
  { featureKey: 'increase-upi-limit', title: 'Increase UPI Limit', description: 'Raise your daily or per-transaction UPI limit', category: 'UPI', module: 'UPI', route: '/upi/limit', icon: 'trending-up', keywords: ['upi limit', 'raise upi', 'upi daily limit', 'increase transaction limit'], aliases: ['change upi limit', 'upi cap'], synonyms: ['raise upi limit'], estimatedTime: '1 min', shortcut: '⌘U', popularity: 920 },
  { featureKey: 'open-fd', title: 'Open Fixed Deposit', description: 'Start a new FD with flexible tenure and competitive rates', category: 'Investments', module: 'Investments', route: '/investments/fd/new', icon: 'piggy-bank', keywords: ['fixed deposit', 'fd', 'open fd', 'create fd', 'book fd', 'start fd'], aliases: ['new fixed deposit'], synonyms: ['book fd', 'create fd'], estimatedTime: '5 min', shortcut: '⌘F', popularity: 760 },
  { featureKey: 'download-statement', title: 'Download Account Statement', description: 'Download your account statement as PDF or CSV', category: 'Accounts', module: 'Accounts', route: '/accounts/statement', icon: 'download', keywords: ['statement', 'account statement', 'bank statement', 'download statement', 'transaction history'], aliases: ['get statement'], synonyms: ['bank statement', 'transaction history'], estimatedTime: '10 sec', shortcut: '⌘S', popularity: 1200 },
  { featureKey: 'apply-personal-loan', title: 'Apply Personal Loan', description: 'Get instant personal loan up to ₹20 lakhs at 10.9% p.a.', category: 'Loans', module: 'Loans', route: '/loans/personal/apply', icon: 'banknote', keywords: ['personal loan', 'apply loan', 'instant loan', 'quick loan', 'cash loan'], aliases: ['get personal loan'], synonyms: ['instant personal loan'], estimatedTime: '15 min', shortcut: '⌘L', popularity: 680 },
  { featureKey: 'order-cheque-book', title: 'Order Cheque Book', description: 'Request a new cheque book for your savings account', category: 'Accounts', module: 'Accounts', route: '/accounts/cheque-book', icon: 'book', keywords: ['cheque book', 'order cheque', 'new cheque book', 'chequebook'], aliases: ['request cheque book'], synonyms: ['chequebook'], estimatedTime: '2 min', shortcut: '⌘C', popularity: 440 },
  { featureKey: 'change-address', title: 'Update Address', description: 'Update your registered home or office address', category: 'Settings', module: 'Profile', route: '/settings/address', icon: 'map-pin', keywords: ['change address', 'update address', 'new address', 'address update', 'edit address'], aliases: ['modify address'], synonyms: ['address change'], estimatedTime: '3 min', shortcut: null, popularity: 390 },
  { featureKey: 'pay-electricity-bill', title: 'Pay Electricity Bill', description: 'Pay BSES, MSEDCL, BESCOM and other electricity bills', category: 'Payments', module: 'Payments', route: '/payments/bills/electricity', icon: 'zap', keywords: ['electricity bill', 'pay electricity', 'bijli bill', 'bses', 'msedcl'], aliases: ['electricity payment'], synonyms: ['bijli payment'], estimatedTime: '1 min', shortcut: '⌘E', popularity: 1100 },
  { featureKey: 'transfer-money', title: 'Transfer Money', description: 'Send money via UPI, NEFT, RTGS or IMPS instantly', category: 'Payments', module: 'Payments', route: '/payments/transfer', icon: 'send', keywords: ['transfer money', 'send money', 'pay', 'neft', 'imps', 'upi transfer'], aliases: ['fund transfer', 'send funds'], synonyms: ['send money'], estimatedTime: '30 sec', shortcut: '⌘T', popularity: 1500 },
  { featureKey: 'check-balance', title: 'Check Account Balance', description: 'View available and total balance across all accounts', category: 'Accounts', module: 'Accounts', route: '/accounts', icon: 'wallet', keywords: ['balance', 'check balance', 'account balance', 'available balance', 'bank balance'], aliases: ['view balance'], synonyms: ['bank balance'], estimatedTime: '5 sec', shortcut: '⌘W', popularity: 1800 },
  { featureKey: 'start-sip', title: 'Start SIP', description: 'Begin Systematic Investment Plan in mutual funds', category: 'Investments', module: 'Investments', route: '/investments/sip/new', icon: 'trending-up', keywords: ['sip', 'systematic investment', 'mutual fund sip', 'start sip', 'monthly sip'], aliases: ['create sip'], synonyms: ['monthly investment'], estimatedTime: '8 min', shortcut: '⌘I', popularity: 550 },
  { featureKey: 'buy-insurance', title: 'Buy Insurance', description: 'Purchase life, health, vehicle or travel insurance', category: 'Insurance', module: 'Insurance', route: '/insurance/buy', icon: 'shield', keywords: ['insurance', 'buy insurance', 'term plan', 'health insurance', 'life insurance'], aliases: ['purchase insurance', 'get insurance'], synonyms: ['insurance plan'], estimatedTime: '10 min', shortcut: null, popularity: 410 },
  { featureKey: 'scan-pay-qr', title: 'Scan & Pay QR', description: 'Scan any QR code and pay instantly via UPI', category: 'UPI', module: 'UPI', route: '/upi/scan', icon: 'qr-code', keywords: ['scan qr', 'qr payment', 'scan and pay', 'upi qr', 'bhim upi'], aliases: ['qr scan pay'], synonyms: ['scan to pay'], estimatedTime: '20 sec', shortcut: '⌘Q', popularity: 900 },
  { featureKey: 'update-nominee', title: 'Update Nominee', description: 'Add or change nominee for your savings account', category: 'Settings', module: 'Profile', route: '/settings/nominee', icon: 'user-check', keywords: ['nominee', 'update nominee', 'add nominee', 'change nominee', 'nomination'], aliases: ['modify nominee'], synonyms: ['nomination'], estimatedTime: '3 min', shortcut: null, popularity: 280 },
  { featureKey: 'credit-card-bill', title: 'Pay Credit Card Bill', description: 'Pay your SBI credit card outstanding or minimum due', category: 'Cards', module: 'Cards', route: '/cards/credit/pay', icon: 'credit-card', keywords: ['credit card bill', 'pay credit card', 'cc bill', 'card dues', 'minimum due'], aliases: ['credit card payment'], synonyms: ['cc payment'], estimatedTime: '2 min', shortcut: null, popularity: 720 },
  { featureKey: 'mobile-recharge', title: 'Mobile Recharge', description: 'Recharge Airtel, Jio, Vi, BSNL and other operators', category: 'Payments', module: 'Payments', route: '/payments/recharge', icon: 'smartphone', keywords: ['recharge', 'mobile recharge', 'prepaid recharge', 'phone recharge', 'airtel jio'], aliases: ['prepaid top-up'], synonyms: ['top-up mobile'], estimatedTime: '30 sec', shortcut: null, popularity: 980 },
  { featureKey: 'loan-emi-payment', title: 'Pay Loan EMI', description: 'Pay your home loan, car loan or personal loan EMI', category: 'Loans', module: 'Loans', route: '/loans/emi/pay', icon: 'landmark', keywords: ['emi', 'loan emi', 'pay emi', 'home loan emi', 'car loan emi'], aliases: ['loan installment'], synonyms: ['loan payment'], estimatedTime: '1 min', shortcut: null, popularity: 840 },
  { featureKey: 'kyc-update', title: 'Update KYC', description: 'Complete or update your KYC documentation', category: 'Settings', module: 'Profile', route: '/settings/kyc', icon: 'file-check', keywords: ['kyc', 'update kyc', 'kyc verification', 'complete kyc', 'video kyc'], aliases: ['verify identity'], synonyms: ['kyc verification'], estimatedTime: '5 min', shortcut: null, popularity: 490 },
  { featureKey: 'credit-score', title: 'Check Credit Score', description: 'View your CIBIL credit score and report', category: 'Accounts', module: 'Accounts', route: '/accounts/credit-score', icon: 'bar-chart', keywords: ['credit score', 'cibil', 'credit report', 'credit rating'], aliases: ['cibil score'], synonyms: ['credit rating'], estimatedTime: '5 sec', shortcut: null, popularity: 630 },
];

export async function seedSearchIndex(): Promise<void> {
  try {
    const count = await prisma.searchIndex.count();
    if (count > 0) return; // already seeded

    await prisma.searchIndex.createMany({
      data: SEARCH_INDEX_DATA.map((item) => ({
        ...item,
        keywords: JSON.stringify(item.keywords),
        aliases: JSON.stringify(item.aliases),
        synonyms: JSON.stringify(item.synonyms),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    } as any);

    logger.info(`Search index seeded with ${SEARCH_INDEX_DATA.length} features`);
  } catch (err) {
    logger.warn('Failed to seed search index', { error: (err as Error).message });
  }
}
