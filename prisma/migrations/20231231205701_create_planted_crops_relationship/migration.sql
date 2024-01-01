/*
  Warnings:

  - You are about to drop the column `planted_crops` on the `rural_producer` table. All the data in the column will be lost.
  - Changed the type of `state` on the `rural_producer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('acre', 'alagoas', 'amapa', 'amazonas', 'bahia', 'ceara', 'distrito_federal', 'espirito_santo', 'goias', 'maranhao', 'mato_grosso', 'mato_grosso_do_sul', 'minas_gerais', 'para', 'paraiba', 'parana', 'pernambuco', 'piaui', 'rio_de_janeiro', 'rio_grande_do_norte', 'rio_grande_do_sul', 'rondonia', 'roraima', 'santa_catarina', 'sao_paulo', 'sergipe', 'tocantins');

-- AlterTable
ALTER TABLE "rural_producer" DROP COLUMN "planted_crops",
DROP COLUMN "state",
ADD COLUMN     "state" "State" NOT NULL;

-- CreateTable
CREATE TABLE "planted_crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "planted_crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlantedCropToRuralProducer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlantedCropToRuralProducer_AB_unique" ON "_PlantedCropToRuralProducer"("A", "B");

-- CreateIndex
CREATE INDEX "_PlantedCropToRuralProducer_B_index" ON "_PlantedCropToRuralProducer"("B");

-- AddForeignKey
ALTER TABLE "_PlantedCropToRuralProducer" ADD CONSTRAINT "_PlantedCropToRuralProducer_A_fkey" FOREIGN KEY ("A") REFERENCES "planted_crop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlantedCropToRuralProducer" ADD CONSTRAINT "_PlantedCropToRuralProducer_B_fkey" FOREIGN KEY ("B") REFERENCES "rural_producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
