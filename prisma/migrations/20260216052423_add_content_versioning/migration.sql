-- CreateTable
CREATE TABLE "ContentAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "previousValue" TEXT,
    "newValue" TEXT,
    "updatedBy" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContentHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "versionLabel" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ContentAudit_key_idx" ON "ContentAudit"("key");

-- CreateIndex
CREATE INDEX "ContentAudit_entityType_idx" ON "ContentAudit"("entityType");

-- CreateIndex
CREATE INDEX "ContentHistory_key_idx" ON "ContentHistory"("key");

-- CreateIndex
CREATE INDEX "ContentHistory_entityType_idx" ON "ContentHistory"("entityType");
