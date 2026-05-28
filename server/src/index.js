import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});

io.on("connection", socket => {
  console.log("client connected");

  socket.on("new-order", data => {
    io.emit("order-created", data);
  });

  socket.on("change-status", data => {
    io.emit("status-updated", data);
  });
});

app.get("/", (_, res) => {
  res.send("Super Pizza API Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
