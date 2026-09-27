-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'COMPLETED');

-- AlterTable
ALTER TABLE "freights" ADD COLUMN "selected_application_id" TEXT;

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "freight_id" TEXT NOT NULL,
    "freighter_id" TEXT NOT NULL,
    "proposed_price" DECIMAL(12,2) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_freight_id_freighter_id_key" ON "applications"("freight_id", "freighter_id");

-- CreateIndex
CREATE UNIQUE INDEX "freights_selected_application_id_key" ON "freights"("selected_application_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_freight_id_fkey" FOREIGN KEY ("freight_id") REFERENCES "freights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_freighter_id_fkey" FOREIGN KEY ("freighter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freights" ADD CONSTRAINT "freights_selected_application_id_fkey" FOREIGN KEY ("selected_application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
