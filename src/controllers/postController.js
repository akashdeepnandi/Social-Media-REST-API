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