/*
  Warnings:

  - You are about to drop the `_PlantedCropToRuralProducer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planted_crop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rural_producer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlantedCropToRuralProducer" DROP CONSTRAINT "_PlantedCropToRuralProducer_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlantedCropToRuralProducer" DROP CONSTRAINT "_PlantedCropToRuralProducer_B_fkey";

-- DropTable
DROP TABLE "_PlantedCropToRuralProducer";

-- DropTable
DROP TABLE "planted_crop";

-- DropTable
DROP TABLE "rural_producer";

-- CreateTable
CREATE TABLE "rural_producers" (
    "id" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "producer_name" TEXT NOT NULL,
    "farm_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "agricultural_area_hectares" INTEGER NOT NULL,
    "vegetation_area_hectares" INTEGER NOT NULL,
    "total_area_hectares" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rural_producers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planted_crops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rural_producer_id" TEXT,

    CONSTRAINT "planted_crops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rural_producers_cpf_cnpj_key" ON "rural_producers"("cpf_cnpj");

-- AddForeignKey
ALTER TABLE "planted_crops" ADD CONSTRAINT "planted_crops_rural_producer_id_fkey" FOREIGN KEY ("rural_producer_id") REFERENCES "rural_producers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
