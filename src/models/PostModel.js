const { model } = require("mongoose");
const { PostSchema } = require("../schemas/PostSchema");

exports.PostModel = model('post', PostSchema);