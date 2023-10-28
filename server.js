const http = require("http");
const app = require("./app");
const { connectToDb } = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT;

connectToDb();

const server = http.createServer(app);

server.listen(PORT || 5000, () => console.log(`Server is listening on http://localhost:${PORT}`));
