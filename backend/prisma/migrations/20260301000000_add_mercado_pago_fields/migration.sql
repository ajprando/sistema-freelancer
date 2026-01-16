-- AlterTable
ALTER TABLE "pagamento" ADD COLUMN "referencia" TEXT;
ALTER TABLE "pagamento" ADD COLUMN "metodo" TEXT NOT NULL DEFAULT 'PIX';
ALTER TABLE "pagamento" ADD COLUMN "qr_code_base64" TEXT;
ALTER TABLE "pagamento" ADD COLUMN "mercado_pago_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_mercado_pago_id_key" ON "pagamento"("mercado_pago_id");
