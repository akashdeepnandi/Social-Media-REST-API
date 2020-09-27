const { model } = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

const UserModel = model("user", UserSchema);

module.exports = UserModel;