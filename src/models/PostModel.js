const { model } = require("mongoose");
const { PostSchema } = require("../schemas/PostSchema");

PostModel = model('post', PostSchema);

module.exports = PostModel;