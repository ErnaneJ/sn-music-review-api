const server = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`-> Server running on http://localhost:${PORT} 🚀`);
  console.log(`-> Prisma running on http://localhost:5555 🚀`);
});