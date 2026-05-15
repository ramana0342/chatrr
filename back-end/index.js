import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import pool from "./config/database.js";
import { setupChatSocket } from "./sockets/chatSocket.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"


const app = express();

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupChatSocket(io);

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatrr-ten.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/chatrr/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database Connected Successfully");
    console.log("DB Time:", result.rows[0].now);

    server.listen(PORT, () => {
      console.log(`Server started running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();