const { execSync } = require("child_process");

module.exports = async () => {
  execSync("npx prisma migrate reset --schema=./prisma/schema.prisma --force");
};
