-- AlterTable
ALTER TABLE "Song" ADD COLUMN "cover_image" TEXT;
ALTER TABLE "Song" ADD COLUMN "did" INTEGER;
ALTER TABLE "Song" ADD COLUMN "duration" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "image" TEXT;
ALTER TABLE "User" ADD COLUMN "name" TEXT;
