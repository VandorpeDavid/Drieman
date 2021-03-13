import http from "http";
import socketio from "socket.io";
import express from "express";

export const app = express();
export const server = http.createServer(app);
export const io = new socketio.Server(server, {
    cors: {
        origin: '*',
            methods: ["GET", "POST"]
    }
});
