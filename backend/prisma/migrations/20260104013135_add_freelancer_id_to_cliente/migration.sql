/*
  Warnings:

  - Added the required column `freelancer_id` to the `cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "freelancer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "freelancer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
