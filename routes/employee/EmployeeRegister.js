const express = require("express");
const Formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Employee } = require("../../models/employee");

const route = express.Router();

route.post("/", async (req, res) => {
  try {
    // query
    const Username = await Employee.find({
      Username: req.body.Username,
    });
    const Email = await Employee.find({
      Email: req.body.Email,
    });

    // response logic if there is a existing account

    if (Username.length > 0 && Email.length > 0) {
      res.send("This user is already registered!");
      return;
    } else if (Username.length > 0 || Email.length > 0) {
      if (Username.length > 0) {
        res.send("This Username is already exist");
      } else if (Email.length > 0) {
        res.send("This Email is already exist");
      }
    } else {
      const UserRegisterData = {
        Username: req.body.Username,
        Email: req.body.Email,
        Profile_Picture: [],
        Role: "Employee",
      };

      const token = jwt.sign(
        { Username: req.body.Username, Role: UserRegisterData.Role },
        "x-auth-token"
      );

      // Hashing password
      const salt = await bcrypt.genSalt(10);
      UserRegisterData.Password = await bcrypt.hash(req.body.Password, salt);

      // Database code
      await new Employee(UserRegisterData).save();

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
        const user = await Employee.findOne({ Username: fields.User[0] });
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

    // Routing for getting specific Admin to show profile picture
    route.get("/employee-profile-picture/:username", async (req, res) => {
      try {
        const result = await Employee.findOne({
          Username: req.params.username,
        });
        res.send(result.Profile_Picture[0]);
      } catch (ex) {
        console.log(ex.message);
      }
    });
  } catch (ex) {
    console.log(ex.message);
  }
});

module.exports = route;
