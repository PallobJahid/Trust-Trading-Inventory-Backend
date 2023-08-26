const express = require("express");
const Formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../../models/admin");

const route = express.Router();

route.post("/", async (req, res) => {
  try {
    // query
    const Username = await Admin.find({
      Username: req.body.Username,
    });
    const Email = await Admin.find({
      Email: req.body.Email,
    });

    // response logic if there is a existing account and sending response with status to client

    if (Username.length > 0 && Email.length > 0) {
      res.status(400).send("This user is already registered!");
      return;
    } else if (Username.length > 0 || Email.length > 0) {
      if (Username.length > 0) {
        res.status(400).send("This Username is already exist");
      } else if (Email.length > 0) {
        res.status(400).res.send("This Email is already exist");
      }
    } else {
      const UserRegisterData = {
        Username: req.body.Username,
        Email: req.body.Email,
        Profile_Picture: [],
        Role: "Admin",
      };

      const token = jwt.sign(
        { Username: req.body.Username, Role: UserRegisterData.Role },
        "x-auth-token"
      );

      // Hashing password
      const salt = await bcrypt.genSalt(10);
      UserRegisterData.Password = await bcrypt.hash(req.body.Password, salt);

      // Database code
      await new Admin(UserRegisterData).save();

      // Setting header
      res.header("x-auth-token", token);
      res.header("access-control-expose-header", "x-auth-token").send(token);
    }
  } catch (ex) {
    console.log(ex.message);
  }
});

// Routing for Profile Picture

route.post("/profile-picture", async (req, res) => {
  try {
    const form = new Formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      if (files) {
        const user = await Admin.findOne({ Username: fields.User[0] });
        if (user) {
          const img = fs.readFileSync(files.Images[0].filepath);
          const src = img.toString("base64");
          const imageDetails = {
            filename: files.Images[0].originalFilename,
            contentType: files.Images[0].mimetype,
            imageBase64: src,
          };
          user.Profile_Picture.push(imageDetails);
          user.save();
        }
      }
    });
  } catch (ex) {
    console.log(ex.message);
  }
});

// Routing for getting specific Admin to show profile picture

route.get("/admin-profile-picture/:username", async (req, res) => {
  try {
    const result = await Admin.findOne({ Username: req.params.username });
    res.send(result.Profile_Picture[result.Profile_Picture.length - 1]);
  } catch (ex) {
    console.log(ex.message);
  }
});

module.exports = route;
