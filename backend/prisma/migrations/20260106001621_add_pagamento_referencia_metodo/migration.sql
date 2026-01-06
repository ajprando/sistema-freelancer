/*
  Warnings:

  - A unique constraint covering the columns `[referencia]` on the table `pagamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mercado_pago_id]` on the table `pagamento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metodo` to the `pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referencia` to the `pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pagamento" ADD COLUMN     "mercado_pago_id" TEXT,
ADD COLUMN     "metodo" TEXT NOT NULL,
ADD COLUMN     "referencia" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_referencia_key" ON "pagamento"("referencia");

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_mercado_pago_id_key" ON "pagamento"("mercado_pago_id");
