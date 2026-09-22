const { createPost, getFeed, likePost, getMyPosts,
    dislikePost, commentOnPost, uploadPostImage} = require("../controllers/post.controller");
const { userAuth } = require("../middleWares/auth");
const upload = require("../middleWares/upload");

const express = require('express')
const router = express.Router()


router.post("/post", userAuth, upload.single("image"), createPost);
router.get("/posts/feed", userAuth, getFeed);
router.get("/posts/mypost", userAuth, getMyPosts);
router.post("/post/:postId/like", userAuth, likePost);
router.post("/post/:postId/dislike", userAuth, dislikePost);
router.post("/post/:postId/comment", userAuth, commentOnPost);
router.post("/upload/image", userAuth,upload.single("image"),uploadPostImage);

module.exports = router;