

const socket = require("socket.io");
const crypto = require("crypto")

const getSecretRoomid = (userId, targetUserId) =>{

       return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join("_"))
        .digest('hex');
    } 


const setupWebSocket = (server) => {

    
        
    const io = socket(server, {
        cors: {
            origin: "https://devloper-tinder.vercel.app"
            // origin: "http://lcalhost:5173"

        },
    });

    io.on("connection", (socket) => {
        // console.log("Client connected:", socket.id);
        socket.on("joinChat", ({ Fname, userId, targetUserId }) => {
            const roomId = getSecretRoomid(userId, targetUserId)
            // console.log(Fname + " Joining Room: " + roomId);
            socket.join(roomId)
        })


        // Listen for a custom event from the client
        socket.on("sendMessage", ({ Fname, userId, targetUserId, text }) => {
            const roomId = getSecretRoomid(userId, targetUserId)
            //  console.log(Fname + " " + text);
            io.to(roomId).emit("messageReceived", { Fname, text })



        });

        // Disconnect event
        socket.on("disconnect", (reason) => {
            //console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = { setupWebSocket };