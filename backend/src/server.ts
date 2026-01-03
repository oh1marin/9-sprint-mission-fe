import http from "http";
import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 4000;

const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
