/*
  Warnings:

  - Made the column `status` on table `TestCaseResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TestCaseResult" ADD COLUMN     "memory" TEXT,
ALTER COLUMN "status" SET NOT NULL;
