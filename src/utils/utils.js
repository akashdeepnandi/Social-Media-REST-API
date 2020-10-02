const jwt = require("jsonwebtoken");
require("dotenv").config();
const MAX_AGE = 3 * 24 * 60 * 60;
require('dotenv').config()
const { unlinkSync, existsSync } = require("fs");

const createToken = async (id, res) => {
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
  res.cookie("jwt", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
};

const fileUploader = (req, res, path) => {
  try {
    if (!req.files) {
      return;
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      const image = req.files.image;

			const filename = Date.now() + image.name;
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      image.mv(`${process.env.PWD}/uploads/${path}/${filename}`);

      //send response
      return filename;
    }
  } catch (err) {
		console.log(err);
    res.status(500).json({
      errors: [
        {
          msg: "Internal server error",
          param: "server",
        },
      ],
    });
  }
};

const fileDeleter = (name, route) => {
  const filepath = 	`${process.env.PWD}/uploads/${route}/${name}`;
	if(existsSync(filepath)) unlinkSync(filepath);
	return
}

module.exports = {
  createToken,
  MAX_AGE,
	fileUploader,
	fileDeleter
};
