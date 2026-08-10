
const { Server } = require("socket.io");

const setupWebSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"

        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Send a welcome event
        socket.emit("welcome", "Welcome!");

        // Listen for a custom event from the client
        socket.on("sendMessage", (message) => {
            console.log("Received:", message.toString());

            // Send a response back to client
            socket.emit("message", "Message received!");
        });

        // Disconnect event
        socket.on("disconnect", (reason) => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = { setupWebSocket };