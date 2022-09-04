/*
  Warnings:

  - A unique constraint covering the columns `[resentCode]` on the table `UserVerificationReset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resentCode` to the `UserVerificationReset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserVerificationReset` ADD COLUMN `resentCode` VARCHAR(256) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserVerificationReset_resentCode_key` ON `UserVerificationReset`(`resentCode`);
