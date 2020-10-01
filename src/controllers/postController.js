const { validationResult } = require("express-validator");
const PostModel = require("../models/PostModel");
const { fileUploader, fileDeleter } = require("../utils/utils");
require("dotenv").config();

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const image = fileUploader(req, res, process.env.POST_IMAGES_DIR);
    const post = await PostModel.create({
      ...req.body,
      user: res.locals.user._id,
      image,
    });
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({});
    if (!posts)
      return res.json({
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
          msg: "Internal Server Error",
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
    const updatedPost = await PostModel.findOne({ _id: post_id });
    if (!updatedPost)
      return res.status(404).json({
        errors: [
          {
            msg: "Post not found",
            param: "post",
          },
        ],
      });

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
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
    return res.status(204).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
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
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
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
            param: "comment",
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
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};
