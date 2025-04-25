/*
  Warnings:

  - You are about to drop the column `authorId` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `certificates` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `github` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_authorId_fkey";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "authorId",
DROP COLUMN "content",
DROP COLUMN "published",
ADD COLUMN     "certificates" JSONB NOT NULL,
ADD COLUMN     "contact" JSONB NOT NULL,
ADD COLUMN     "education" JSONB NOT NULL,
ADD COLUMN     "experience" JSONB NOT NULL,
ADD COLUMN     "github" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT NOT NULL,
ADD COLUMN     "project" JSONB NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
