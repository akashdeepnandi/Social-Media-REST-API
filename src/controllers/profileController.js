const { ProfileModel } = require("../models/ProfileModel");
const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const { fileUploader, fileDeleter } = require("../utils/utils");
require("dotenv").config();
const { unlinkSync, existsSync } = require("fs");

exports.createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    const { about, birthDate } = req.body;
    const image = fileUploader(req, res);
    profile = await ProfileModel.create({
      user: res.locals.user._id,
      about,
      birthDate,
      image,
    });
    res.status(201).json(profile);
  } catch (err) {
		console.log(err);
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
		const image = fileUploader(req, res);
		if(image) {
			if(profile.image) fileDeleter(profile.image);
			await ProfileModel.findOneAndUpdate({ user: res.locals.user._id }, {...req.body, image});
		} else {
			await ProfileModel.findOneAndUpdate({ user: res.locals.user._id }, req.body);
		}
    const updatedProfile = await ProfileModel.findOne({
      user: res.locals.user._id,
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
    const profile = await ProfileModel.findOne({ user });
    if (!profile)
      return res.json({
        errors: [
          {
            msg: "Profile not found",
            param: "profile",
          },
        ],
      });
    await ProfileModel.findOneAndRemove({ user });
    await UserModel.findOneAndRemove({ _id: user });
    if (profile.image) fileDeleter(profile.image);
    return res.status(204).json({});
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

exports.sendProfileImage = ({ params: { name } }, res) => {
  const filepath = 	`${process.env.PWD}/uploads/profile/images/${name}`;

  if (existsSync(filepath)) res.sendFile(filepath);
  else
    res.status(404).json({
      errors: [
        {
          msg: "Image not found",
          param: "image",
        },
      ],
    });
};
