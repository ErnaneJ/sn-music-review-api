/*
  Warnings:

  - A unique constraint covering the columns `[userId,songId]` on the table `FavoriteSong` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSong_userId_songId_key" ON "FavoriteSong"("userId", "songId");
