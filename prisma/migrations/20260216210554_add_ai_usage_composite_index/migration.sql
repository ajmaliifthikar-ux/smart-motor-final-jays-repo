-- CreateTable
CREATE TABLE "IntegrationTrace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "error" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "IntegrationTrace_service_idx" ON "IntegrationTrace"("service");

-- CreateIndex
CREATE INDEX "IntegrationTrace_status_idx" ON "IntegrationTrace"("status");

-- CreateIndex
CREATE INDEX "IntegrationTrace_timestamp_idx" ON "IntegrationTrace"("timestamp");

-- CreateIndex
CREATE INDEX "AIUsageLog_userId_action_createdAt_idx" ON "AIUsageLog"("userId", "action", "createdAt");
