const { execSync } = require("child_process");

require('dotenv').config();
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

module.exports = async () => {
  execSync("npx prisma migrate dev --schema=./prisma/schema.prisma");
  execSync("npx prisma generate --schema=./prisma/schema.prisma");
};
