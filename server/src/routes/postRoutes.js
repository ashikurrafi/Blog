const express = require("express");
const { createPost, updatePost } = require("../controllers/postControllers");
const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authGuard, adminGuard, createPost);
router.put("/:slug", authGuard, adminGuard, updatePost);

module.exports = router;
