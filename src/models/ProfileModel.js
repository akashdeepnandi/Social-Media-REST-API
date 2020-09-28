const { model } = require("mongoose");
const { ProfileSchema } = require("../schemas/ProfileSchema");

exports.ProfileModel = model("profile", ProfileSchema);
