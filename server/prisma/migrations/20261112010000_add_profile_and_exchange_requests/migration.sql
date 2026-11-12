ALTER TABLE "users" ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "resetPasswordToken" TEXT,
ADD COLUMN "resetPasswordExpires" TIMESTAMP(3);

CREATE TABLE "exchange_requests" (
    "id" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "users_resetPasswordToken_idx" ON "users"("resetPasswordToken");

CREATE INDEX "exchange_requests_ownerId_idx" ON "exchange_requests"("ownerId");

CREATE INDEX "exchange_requests_requesterId_idx" ON "exchange_requests"("requesterId");

CREATE INDEX "exchange_requests_bookId_idx" ON "exchange_requests"("bookId");

ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exchange_requests" ADD CONSTRAINT "exchange_requests_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

