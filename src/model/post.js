const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2000
        },

        image: {
            url: {
                type: String
            },

            publicId: {
                type: String
            }
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                text: {
                    type: String,
                    required: true,
                    trim: true,
                    maxLength: 500
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);