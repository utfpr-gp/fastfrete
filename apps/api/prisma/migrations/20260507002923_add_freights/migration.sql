-- CreateEnum
CREATE TYPE "FreightStatus" AS ENUM ('OPEN', 'NEGOTIATING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FreightDateMode" AS ENUM ('IMMEDIATE', 'SCHEDULED', 'FLEXIBLE');

-- CreateTable
CREATE TABLE "freights" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "vehicle_category" VARCHAR(50) NOT NULL,
    "origin_city_id" TEXT NOT NULL,
    "origin_district" VARCHAR(100) NOT NULL,
    "origin_street" VARCHAR(150) NOT NULL,
    "origin_number" VARCHAR(20) NOT NULL,
    "destination_city_id" TEXT NOT NULL,
    "destination_district" VARCHAR(100) NOT NULL,
    "destination_street" VARCHAR(150) NOT NULL,
    "destination_number" VARCHAR(20) NOT NULL,
    "date_mode" "FreightDateMode" NOT NULL,
    "exact_datetime" TIMESTAMP(3),
    "availability_window" VARCHAR(30),
    "status" "FreightStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "freights" ADD CONSTRAINT "freights_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freights" ADD CONSTRAINT "freights_origin_city_id_fkey" FOREIGN KEY ("origin_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freights" ADD CONSTRAINT "freights_destination_city_id_fkey" FOREIGN KEY ("destination_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
