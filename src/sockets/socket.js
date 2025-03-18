import { Server } from "socket.io";

/**
 * Initialize the Socket.IO server.
 *
 * @param {object} server - The HTTP server instance.
 */
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust origin based on your application's needs
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Handle custom events here
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });

    return io; // Return the Socket.IO instance for further use
};
