import { Server } from "socket.io";

let io;

export const initSocket = (server, corsOptions) => {
    io = new Server(server, { cors: corsOptions });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_user", ({ userId, role }) => {
            if (!userId || !role) return;

            socket.join(`user_${userId}`);
            socket.join(`role_${role}`);

            console.log(`User ${userId} joined role_${role}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) throw new Error("Socket not initialized");
    return io;
};
