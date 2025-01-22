/*
  Warnings:

  - You are about to alter the column `did` on the `Song` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Made the column `did` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT,
    "genre" TEXT,
    "releaseYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "did" BIGINT NOT NULL,
    "cover_image" TEXT,
    "duration" INTEGER
);
INSERT INTO "new_Song" ("album", "artist", "cover_image", "createdAt", "did", "duration", "genre", "id", "releaseYear", "title", "updatedAt") SELECT "album", "artist", "cover_image", "createdAt", "did", "duration", "genre", "id", "releaseYear", "title", "updatedAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
