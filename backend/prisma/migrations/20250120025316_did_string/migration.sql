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
    "did" TEXT NOT NULL,
    "cover_image" TEXT,
    "duration" INTEGER
);
INSERT INTO "new_Song" ("album", "artist", "cover_image", "createdAt", "did", "duration", "genre", "id", "releaseYear", "title", "updatedAt") SELECT "album", "artist", "cover_image", "createdAt", "did", "duration", "genre", "id", "releaseYear", "title", "updatedAt" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
