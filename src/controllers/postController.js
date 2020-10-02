const { validationResult } = require("express-validator");
const PostModel = require("../models/PostModel");
const { fileUploader, fileDeleter } = require("../utils/utils");
require("dotenv").config();
const { existsSync } = require("fs");

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const image = fileUploader(req, res, process.env.POST_IMAGES_DIR);
    let post = await PostModel.create({
      ...req.body,
      user: res.locals.user._id,
      image,
    });
    post = await PostModel.findOne({ _id: post._id }).populate("user", [
      "firstName",
      "lastName",
      "email",
    ]);
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({})
      .populate("user", ["firstName", "lastName", "email"])
      .populate("comments.user", ["firstName", "lastName", "email"])
      .populate("likes.user", ["firstName", "lastName", "email"]);
    if (!posts)
      return res.status(404).json({
        errors: [
          {
            msg: "No posts",
            param: "post",
          },
        ],
      });
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.editPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    params: { post_id },
    body,
  } = req;
  try {
    const post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    if (!post.user.equals(res.locals.user._id))
      return res.status(401).json({
        errors: [
          {
            msg: "You are not owner of the post",
            param: "post",
          },
        ],
      });
    const image = fileUploader(req, res, process.env.POST_IMAGES_DIR);
    if (image) {
      if (post.image) fileDeleter(post.image, process.env.POST_IMAGES_DIR);
      await PostModel.findOneAndUpdate({ _id: post_id }, { ...body, image });
    } else {
      await PostModel.findOneAndUpdate({ _id: post_id }, { ...body });
    }
    const updatedPost = await PostModel.findOne({ _id: post_id })
      .populate("user", ["firstName", "lastName", "email"])
      .populate("comments.user", ["firstName", "lastName", "email"])
      .populate("likes.user", ["firstName", "lastName", "email"]);

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.deletePost = async ({ params: { post_id } }, res) => {
  try {
    const post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    if (!post.user.equals(res.locals.user._id))
      return res.status(401).json({
        errors: [
          {
            msg: "You are not owner of the post",
            param: "post",
          },
        ],
      });
    await PostModel.findOneAndRemove({ _id: post_id });
    if (post.image) fileDeleter(post.image, process.env.POST_IMAGES_DIR);
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    params: { post_id },
    body,
  } = req;
  try {
    let post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    const comment = {
      body: body.body,
      user: res.locals.user._id,
    };
    post.comments.unshift(comment);
    await post.save();
    post = await PostModel.findOne({ _id: post_id })
      .populate("user", ["firstName", "lastName", "email"])
      .populate("comments.user", ["firstName", "lastName", "email"])
      .populate("likes.user", ["firstName", "lastName", "email"]);
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.deleteComment = async ({ params: { post_id, comment_id } }, res) => {
  try {
    let post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    const comment = post.comments.find((comment) => comment.id === comment_id);
    if (!comment)
      return res.json({
        errors: [
          {
            msg: "Comment not found",
            param: "post",
          },
        ],
      });
    if (!comment.user.equals(res.locals.user._id))
      return res.status(401).json({
        errors: [
          {
            msg: "You are not owner of this comment",
            param: "post",
          },
        ],
      });
    post.comments = post.comments.filter(
      (comment) => comment.id !== comment_id
    );
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.addLike = async (req, res) => {
  const {
    params: { post_id },
    body,
  } = req;
  try {
    let post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    let like = post.likes.find((like) => like.user.equals(res.locals.user._id));
    if (like)
      return res.status(409).json({
        errors: [
          {
            msg: "You already have liked the post",
            param: "post",
          },
        ],
      });
    like = {
      user: res.locals.user._id,
    };
    post.likes.unshift(like);
    await post.save();
    post = await PostModel.findOne({ _id: post_id })
      .populate("user", ["firstName", "lastName", "email"])
      .populate("comments.user", ["firstName", "lastName", "email"])
      .populate("likes.user", ["firstName", "lastName", "email"]);
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.deleteLike = async ({ params: { post_id, like_id } }, res) => {
  try {
    let post = await PostModel.findOne({ _id: post_id });
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    const like = post.likes.find((like) => like.id === like_id);
    if (!like)
      return res.json({
        errors: [
          {
            msg: "Like not found",
            param: "post",
          },
        ],
      });
    if (!like.user.equals(res.locals.user._id))
      return res.status(401).json({
        errors: [
          {
            msg: "You are not owner of this like",
            param: "post",
          },
        ],
      });
    post.likes = post.likes.filter((like) => like.id !== like_id);
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

exports.sendPostImage = async ({ params: { name } }, res) => {
  const filepath = `${process.env.PWD}/uploads/${process.env.POST_IMAGES_DIR}/${name}`;
  if (existsSync(filepath)) res.sendFile(filepath);
  else
    res.status(404).json({
      errors: [
        {
          msg: "Image not found",
          param: "post",
        },
      ],
    });
};

exports.findPostById = async ({ params: { post_id } }, res) => {
  try {
    const post = await PostModel.findOne({ _id: post_id })
      .populate("user", ["firstName", "lastName", "email"])
      .populate("comments.user", ["firstName", "lastName", "email"])
      .populate("likes.user", ["firstName", "lastName", "email"]);
    if (!post)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });
    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};
