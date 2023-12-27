-- CreateTable
CREATE TABLE "rural_producer" (
    "id" TEXT NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "producer_name" TEXT NOT NULL,
    "farm_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "agricultural_area_hectares" INTEGER NOT NULL,
    "vegetation_area_hectares" INTEGER NOT NULL,
    "total_area_hectares" INTEGER NOT NULL,
    "planted_crops" TEXT[],

    CONSTRAINT "rural_producer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rural_producer_cpf_cnpj_key" ON "rural_producer"("cpf_cnpj");
