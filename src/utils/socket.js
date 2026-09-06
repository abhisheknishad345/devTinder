

const socket = require("socket.io");
const crypto = require("crypto")
const Chat = require("../model/chat")
const Connection = require("../model/connectionRequest")

const getSecretRoomid = (userId, targetUserId) => {

    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join("_"))
        .digest('hex');
}


const setupWebSocket = (server) => {



    const io = socket(server, {
        cors: {
            origin: "https://devloper-tinder.vercel.app",
            // origin: "http://lcalhost:5173",
            credentials: true

        }
    });

    io.on("connection", (socket) => {
        // console.log("Client connected:", socket.id);
        socket.on("joinChat", ({ Fname, userId, targetUserId }) => {
            const roomId = getSecretRoomid(userId, targetUserId)
            // console.log(Fname + " Joining Room: " + roomId);
            socket.join(roomId)
        })


        // Listen for a custom event from the client
        socket.on("sendMessage", async ({ Fname, Lname, userId, targetUserId, text }) => {

            try {


                const connection = await Connection.findOne({
                    $or: [
                        {
                            fromUserId: userId,
                            toUserId: targetUserId
                        },
                        {
                            fromUserId: targetUserId,
                            toUserId: userId
                        }
                    ],
                    status: "accepted"
                });

                if (!connection) {
                    // console.log("No Connection");
                    socket.emit("chatError", {
                        message: "You can only chat with your connections"
                    });
                    return;
                }

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                });
                // if new chat is there
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }
                // add new chat to db
                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                const roomId = getSecretRoomid(userId, targetUserId)
                //  console.log(Fname + " " + text);
                io.to(roomId).emit("messageReceived", { Fname, Lname, text })

            } catch (err) {
                console.log(err);

            }

        });

        // Disconnect event
        socket.on("disconnect", (reason) => {
            //console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

module.exports = { setupWebSocket };