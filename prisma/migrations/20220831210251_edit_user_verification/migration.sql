/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `UserVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserVerification_verificationCode_key` ON `UserVerification`(`verificationCode`);
