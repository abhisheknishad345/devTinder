const Post = require("../model/post");
const mongoose = require("mongoose");
const ConnectionRequest = require("../model/connectionRequest");
const cloudinary = require("../config/cloudinary");


const createPost = async (req, res) => {
    try {

        const { content } = req.body;

        // Text aur image dono optional nahi hone chahiye
        if ((!content || content.trim() === "") && !req.file) {
            return res.status(400).send("Post must contain text or image");
        }

        let image = null;

        // Agar image upload hui hai
        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "devtinder/posts"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                uploadStream.end(req.file.buffer);
            });

            image = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        const post = await Post.create({
            author: req.user._id,
            content: content ? content.trim() : "",
            image: image
        });

        await post.populate({
            path: "author",
            select: "Fname Lname profileurl"
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (err) {

        res.status(500).send(
            "Error creating post: " + err.message
        );

    }
};

// GET FEED
const getFeed = async (req, res) => {
    try {

        const loggedInUserId = req.user._id;

        // Find all accepted connections
        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        });

        // Get IDs of connected users
        const connectedUserIds = connections.map((connection) => {

            if (connection.fromUserId.equals(loggedInUserId)) {
                return connection.toUserId;
            }

            return connection.fromUserId;
        });


        // Add logged-in user also
        // connectedUserIds.push(loggedInUserId);


        // Find posts of me + accepted connections
        const posts = await Post.find({
            author: { $in: connectedUserIds }
        })
            .populate("author", "Fname Lname profileurl")
            .populate("comments.user", "Fname Lname profileurl")
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: "Feed fetched successfully",
            posts
        });

    } catch (err) {

        res.status(500).send("Error fetching feed: " + err.message);

    }
};

// like
const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send("Post not found");
        }


        // If already liked -> remove like
        if (post.likes.includes(userId)) {

            post.likes.pull(userId);

        } else {

            // If disliked -> remove dislike first
            post.dislikes.pull(userId);

            // Add like
            post.likes.push(userId);
        }

        await post.save();

        res.status(200).json({
            message: "Like updated successfully",
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (err) {
        res.status(500).send("Error liking post: " + err.message);
    }
};

// dislike

const dislikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Already disliked → remove dislike
        if (post.dislikes.includes(userId)) {

            post.dislikes.pull(userId);

        } else {

            // If liked → remove like first
            post.likes.pull(userId);

            // Add dislike
            post.dislikes.push(userId);
        }

        await post.save();

        res.status(200).json({
            message: "Dislike updated successfully",
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (err) {
        res.status(500).send("Error disliking post: " + err.message);
    }
};

// comment
const commentOnPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        // Check comment text
        if (!text || text.trim() === "") {
            return res.status(400).send("Comment cannot be empty");
        }

        // Find post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Add comment
        post.comments.push({
            user: userId,
            text: text.trim()
        });

        await post.save();
        await post.populate({
            path: "comments.user",
            select: "Fname Lname profileurl"
        });

        res.status(201).json({
            message: "Comment added successfully",
            comments: post.comments
        });

    } catch (err) {
        res.status(500).send("Error commenting on post: " + err.message);
    }
};


const uploadPostImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).send("Please upload an image");
        }

        const result = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "devtinder/posts"
                },
                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({
            message: "Image uploaded successfully",
            image: {
                url: result.secure_url,
                publicId: result.public_id
            }
        });

    } catch (err) {

        res.status(500).send(
            "Error uploading image: " + err.message
        );

    }
};

// get your post
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            author: req.user._id
        })
            .populate("author", "Fname Lname profileurl")
            .populate("comments.user", "Fname Lname profileurl")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "My posts fetched successfully",
            posts
        });

    } catch (err) {
        res.status(500).send("Error fetching my posts: " + err.message);
    }
};


module.exports = {
    createPost, getFeed, likePost, dislikePost, commentOnPost, uploadPostImage, getMyPosts
};