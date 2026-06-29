-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "mpin" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "pan" TEXT,
    "aadhar" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "occupation" TEXT,
    "annualIncome" REAL,
    "avatarUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "lastLoginAt" DATETIME,
    "passwordChangedAt" DATETIME,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "balance" REAL NOT NULL DEFAULT 0,
    "availableBalance" REAL NOT NULL DEFAULT 0,
    "minBalance" REAL NOT NULL DEFAULT 0,
    "interestRate" REAL NOT NULL DEFAULT 0,
    "branch" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "micrCode" TEXT,
    "nomineeName" TEXT,
    "nomineeRelation" TEXT,
    "isJointAccount" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT,
    "deviceType" TEXT,
    "platform" TEXT,
    "pushToken" TEXT,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "otp_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "maskedNumber" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "nameOnCard" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "cvvHash" TEXT NOT NULL,
    "creditLimit" REAL,
    "availableCredit" REAL,
    "cashLimit" REAL,
    "dailyAtmLimit" REAL NOT NULL DEFAULT 40000,
    "dailyPosLimit" REAL NOT NULL DEFAULT 100000,
    "internationalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "contactlessEnabled" BOOLEAN NOT NULL DEFAULT true,
    "onlineEnabled" BOOLEAN NOT NULL DEFAULT true,
    "blockedAt" DATETIME,
    "blockedReason" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cards_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountId" TEXT,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "upiId" TEXT,
    "phone" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "transferLimit" REAL NOT NULL DEFAULT 500000,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "beneficiaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "beneficiaries_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "merchant_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mcc" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "logoUrl" TEXT,
    "address" TEXT,
    "city" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "merchants_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "merchant_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "cardId" TEXT,
    "beneficiaryId" TEXT,
    "merchantId" TEXT,
    "referenceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "charges" REAL NOT NULL DEFAULT 0,
    "tax" REAL NOT NULL DEFAULT 0,
    "netAmount" REAL NOT NULL,
    "balanceBefore" REAL NOT NULL,
    "balanceAfter" REAL NOT NULL,
    "description" TEXT,
    "remarks" TEXT,
    "category" TEXT,
    "subCategory" TEXT,
    "senderUpi" TEXT,
    "receiverUpi" TEXT,
    "bankRef" TEXT,
    "ipAddress" TEXT,
    "deviceId" TEXT,
    "location" TEXT,
    "failureReason" TEXT,
    "processedAt" DATETIME,
    "reversedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "loanAccountNumber" TEXT NOT NULL,
    "loanType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "principalAmount" REAL NOT NULL,
    "outstandingAmount" REAL NOT NULL,
    "disbursedAmount" REAL,
    "interestRate" REAL NOT NULL,
    "processingFee" REAL NOT NULL DEFAULT 0,
    "emi" REAL NOT NULL,
    "tenure" INTEGER NOT NULL,
    "remainingTenure" INTEGER NOT NULL,
    "emiDay" INTEGER NOT NULL DEFAULT 5,
    "nextEmiDate" DATETIME,
    "disbursedAt" DATETIME,
    "closedAt" DATETIME,
    "propertyAddress" TEXT,
    "vehicleNumber" TEXT,
    "purposeOfLoan" TEXT,
    "collateral" TEXT,
    "branchCode" TEXT,
    "sanctionedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emi_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loanId" TEXT NOT NULL,
    "installmentNo" INTEGER NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "principal" REAL NOT NULL,
    "interest" REAL NOT NULL,
    "totalEmi" REAL NOT NULL,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "paidAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "emi_schedules_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fixed_deposits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fdAccountNumber" TEXT NOT NULL,
    "principal" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "tenureDays" INTEGER NOT NULL,
    "maturityAmount" REAL NOT NULL,
    "maturityDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isAutoRenew" BOOLEAN NOT NULL DEFAULT false,
    "isTaxSaver" BOOLEAN NOT NULL DEFAULT false,
    "nomineeName" TEXT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "fixed_deposits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recurring_deposits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rdAccountNumber" TEXT NOT NULL,
    "monthlyInstallment" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "completedMonths" INTEGER NOT NULL DEFAULT 0,
    "maturityAmount" REAL NOT NULL,
    "maturityDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "missedInstallments" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recurring_deposits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "provider" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "sumAssured" REAL NOT NULL,
    "premium" REAL NOT NULL,
    "premiumFrequency" TEXT NOT NULL DEFAULT 'ANNUAL',
    "nextDueDate" DATETIME,
    "maturityDate" DATETIME,
    "coverageDetails" TEXT,
    "nominees" TEXT,
    "policyDocument" TEXT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "insurance_policies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceDays" INTEGER,
    "billerCode" TEXT,
    "consumerNo" TEXT,
    "paidAt" DATETIME,
    "paidAmount" REAL,
    "transactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "billingCycle" TEXT NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "vault_folders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vault_folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vault_folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "vault_folders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "folderId" TEXT,
    "loanId" TEXT,
    "insurancePolicyId" TEXT,
    "fixedDepositId" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileKey" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "metadata" TEXT,
    "isAutoGenerated" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessedAt" DATETIME,
    "expiresAt" DATETIME,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "vault_folders" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "documents_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "documents_insurancePolicyId_fkey" FOREIGN KEY ("insurancePolicyId") REFERENCES "insurance_policies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "documents_fixedDepositId_fkey" FOREIGN KEY ("fixedDepositId") REFERENCES "fixed_deposits" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "merchantId" TEXT,
    "userId" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "items" TEXT,
    "taxAmount" REAL,
    "discountAmount" REAL,
    "receiptNumber" TEXT,
    "receiptDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "receipts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "receipts_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "lineItems" TEXT NOT NULL,
    "subTotal" REAL NOT NULL,
    "gst" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "documentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoices_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "serialNumber" TEXT,
    "warrantyPeriod" TEXT NOT NULL,
    "warrantyStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warrantyEnd" DATETIME NOT NULL,
    "supportPhone" TEXT,
    "supportEmail" TEXT,
    "supportUrl" TEXT,
    "documentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "warranties_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "purchase_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "purchase_history_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL,
    "completionPercent" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 10,
    "formData" TEXT NOT NULL DEFAULT '{}',
    "completedFields" TEXT NOT NULL DEFAULT '[]',
    "missingFields" TEXT NOT NULL DEFAULT '[]',
    "steps" TEXT NOT NULL,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "rejectedAt" DATETIME,
    "rejectionReason" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "application_drafts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "fieldData" TEXT NOT NULL,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "application_drafts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "normalizedQuery" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "clickedId" TEXT,
    "clickedType" TEXT,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "search_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "featureKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "icon" TEXT,
    "keywords" TEXT NOT NULL DEFAULT '[]',
    "aliases" TEXT NOT NULL DEFAULT '[]',
    "synonyms" TEXT NOT NULL DEFAULT '[]',
    "estimatedTime" TEXT,
    "shortcut" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiredRole" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dashboard_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "layout" TEXT NOT NULL DEFAULT '[]',
    "pinnedWidgets" TEXT NOT NULL DEFAULT '[]',
    "hiddenWidgets" TEXT NOT NULL DEFAULT '[]',
    "quickActionIds" TEXT NOT NULL DEFAULT '[]',
    "colorScheme" TEXT NOT NULL DEFAULT 'sbi-blue',
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "showBalanceOnLoad" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dashboard_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quick_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" DATETIME,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quick_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recent_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "featureKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "icon" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recent_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" TEXT,
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" DATETIME,
    "failureReason" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reward_points" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "balance" INTEGER NOT NULL,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reward_points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceId" TEXT,
    "metadata" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "support_centers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_customerId_key" ON "users"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_customerId_idx" ON "users"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountNumber_key" ON "accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_accountNumber_idx" ON "accounts"("accountNumber");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_tokenHash_idx" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "user_devices_deviceId_key" ON "user_devices"("deviceId");

-- CreateIndex
CREATE INDEX "user_devices_userId_idx" ON "user_devices"("userId");

-- CreateIndex
CREATE INDEX "otp_records_identifier_purpose_idx" ON "otp_records"("identifier", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "cards_cardNumber_key" ON "cards"("cardNumber");

-- CreateIndex
CREATE INDEX "cards_userId_idx" ON "cards"("userId");

-- CreateIndex
CREATE INDEX "beneficiaries_userId_idx" ON "beneficiaries"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_categories_name_key" ON "merchant_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_categories_code_key" ON "merchant_categories"("code");

-- CreateIndex
CREATE INDEX "merchants_name_idx" ON "merchants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_referenceId_key" ON "transactions"("referenceId");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_accountId_idx" ON "transactions"("accountId");

-- CreateIndex
CREATE INDEX "transactions_referenceId_idx" ON "transactions"("referenceId");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "loans_loanAccountNumber_key" ON "loans"("loanAccountNumber");

-- CreateIndex
CREATE INDEX "loans_userId_idx" ON "loans"("userId");

-- CreateIndex
CREATE INDEX "emi_schedules_loanId_idx" ON "emi_schedules"("loanId");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_deposits_fdAccountNumber_key" ON "fixed_deposits"("fdAccountNumber");

-- CreateIndex
CREATE INDEX "fixed_deposits_userId_idx" ON "fixed_deposits"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recurring_deposits_rdAccountNumber_key" ON "recurring_deposits"("rdAccountNumber");

-- CreateIndex
CREATE INDEX "recurring_deposits_userId_idx" ON "recurring_deposits"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_policyNumber_key" ON "insurance_policies"("policyNumber");

-- CreateIndex
CREATE INDEX "insurance_policies_userId_idx" ON "insurance_policies"("userId");

-- CreateIndex
CREATE INDEX "bills_userId_idx" ON "bills"("userId");

-- CreateIndex
CREATE INDEX "bills_dueDate_idx" ON "bills"("dueDate");

-- CreateIndex
CREATE INDEX "vault_folders_userId_idx" ON "vault_folders"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vault_folders_userId_slug_parentId_key" ON "vault_folders"("userId", "slug", "parentId");

-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE INDEX "documents_folderId_idx" ON "documents"("folderId");

-- CreateIndex
CREATE INDEX "documents_category_idx" ON "documents"("category");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_transactionId_key" ON "receipts"("transactionId");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex
CREATE INDEX "applications_applicationType_idx" ON "applications"("applicationType");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "application_drafts_applicationId_idx" ON "application_drafts"("applicationId");

-- CreateIndex
CREATE INDEX "search_history_userId_idx" ON "search_history"("userId");

-- CreateIndex
CREATE INDEX "search_history_createdAt_idx" ON "search_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "search_index_featureKey_key" ON "search_index"("featureKey");

-- CreateIndex
CREATE INDEX "search_index_featureKey_idx" ON "search_index"("featureKey");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_preferences_userId_key" ON "dashboard_preferences"("userId");

-- CreateIndex
CREATE INDEX "quick_actions_userId_idx" ON "quick_actions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "quick_actions_userId_featureKey_key" ON "quick_actions"("userId", "featureKey");

-- CreateIndex
CREATE INDEX "recent_activities_userId_idx" ON "recent_activities"("userId");

-- CreateIndex
CREATE INDEX "recent_activities_createdAt_idx" ON "recent_activities"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "reward_points_userId_idx" ON "reward_points"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
