const { ProfileModel } = require("../models/ProfileModel");
const { validationResult } = require("express-validator");

exports.createProfile = async (req, res) => {
	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
	let { 
		about,
		birthDate
	} = req.body
	try {
		let profile = await ProfileModel.findOne({ user: res.locals.user._id });
		if(profile) return res.status(409).json({
			errors: [
				{
					msg: "Profile already exists",
					param: "profile"
				}
			]
		})
		profile = await ProfileModel.create({
			user: res.locals.user._id,
			about,
			birthDate
		});
		res.json(profile);
	} catch (err) {
		res.status(400).json({msg: "Some error"});
		// console.log(err)
	}
};

exports.findUserProfile = async (req, res) => {
	try {
		const profile = await ProfileModel.findOne({ user: res.locals.user._id });
		if(!profile) return res.status(404).json({
			errors: [
				{
					msg: "Profile not found",
					param: "profile"
				}
			]
		});
		res.json(profile);
	} catch (err) {
		res.status(500).json({
			errors: [
				{
					msg: "Internal Server Error",
					param: "server"
				}
			]
		})
	}
}