const { ProfileModel } = require("../models/ProfileModel");
const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");

exports.createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { about, birthDate } = req.body;
  try {
    let profile = await ProfileModel.findOne({ user: res.locals.user._id });
    if (profile)
      return res.status(409).json({
        errors: [
          {
            msg: "Profile already exists",
            param: "profile",
          },
        ],
      });
    profile = await ProfileModel.create({
      user: res.locals.user._id,
      about,
      birthDate,
    });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ msg: "Some error" });
    // console.log(err)
  }
};

exports.findUserProfile = async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: res.locals.user._id });
    if (!profile)
      return res.status(404).json({
        errors: [
          {
            msg: "Profile not found",
            param: "profile",
          },
        ],
      });
    res.json(profile);
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};

exports.findUserProfileById = async ({ params: { user_id } }, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: user_id,
    }).populate("user", ["firstName", "lastName", "email"]);
    if (!profile)
      return res.status(404).json({
        errors: [
          {
            msg: "Profile not found",
            param: "profile",
          },
        ],
      });
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};

exports.editProfile = async (req, res) => {
  // res.json({
  // 	errors: [
  // 		{
  // 			msg: "Yes",
  // 			param: "no"
  // 		}
  // 	]
  // });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await ProfileModel.findOneAndUpdate({ user: res.locals.user }, req.body);
    const updatedProfile = await ProfileModel.findOne({
      user: res.locals.user,
    });
    if (!updatedProfile)
      return res.status(404).json({
        errors: [
          {
            msg: "Profile not found",
            param: "profile",
          },
        ],
      });

    res.json(updatedProfile);
  } catch (err) {
    res.status(404).json({
      errors: [
        {
          msg: "Internal Server",
          param: "server",
        },
      ],
    });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.find({}).populate("user", [
      "firstName",
      "lastName",
      "email",
    ]);
    if (!profiles)
      return res.status(204).json({
        errors: [
          {
            msg: "No Profiles Found!",
            param: "profile",
          },
        ],
      });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const {
      locals: { user },
    } = res;
    await ProfileModel.findOneAndRemove({ user: user });
    await UserModel.findOneAndRemove({ _id: user });
    res.status(204).json({
      msg: "success",
    });
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};
