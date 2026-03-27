/*
  Warnings:

  - The values [QUICK,ROAD_SIGNS,FULL_EXAM] on the enum `TestMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `difficulty` on the `Question` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TestMode_new" AS ENUM ('PRACTICE', 'EXAM_SIMULATION', 'WEAK_AREAS');
ALTER TABLE "TestSession" ALTER COLUMN "mode" TYPE "TestMode_new" USING ("mode"::text::"TestMode_new");
ALTER TYPE "TestMode" RENAME TO "TestMode_old";
ALTER TYPE "TestMode_new" RENAME TO "TestMode";
DROP TYPE "TestMode_old";
COMMIT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "difficulty";

-- AlterTable
ALTER TABLE "State" ADD COLUMN     "examPassScore" INTEGER NOT NULL DEFAULT 80,
ADD COLUMN     "examQuestionCount" INTEGER NOT NULL DEFAULT 40;

-- DropEnum
DROP TYPE "Difficulty";
