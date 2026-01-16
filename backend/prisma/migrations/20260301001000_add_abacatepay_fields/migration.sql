-- AlterTable
ALTER TABLE "cliente" ADD COLUMN "tax_id" TEXT;

-- AlterTable
ALTER TABLE "pagamento" ADD COLUMN "gateway" TEXT NOT NULL DEFAULT 'MERCADO_PAGO';
ALTER TABLE "pagamento" ADD COLUMN "abacate_pay_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_abacate_pay_id_key" ON "pagamento"("abacate_pay_id");
