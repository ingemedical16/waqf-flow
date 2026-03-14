-- CreateTable
CREATE TABLE "LaylatCounter" (
    "id" TEXT NOT NULL,
    "mosque" TEXT NOT NULL DEFAULT 'alihssani',
    "amount" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaylatCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LaylatCounter_mosque_idx" ON "LaylatCounter"("mosque");
