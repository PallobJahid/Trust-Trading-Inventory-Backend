const mongoose = require("mongoose");

const Admin = mongoose.model(
  "userlist",
  new mongoose.Schema({
    Email: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      minlength: 5,
      required: true,
    },
    Profile_Picture: [
      {
        filename: String,
        contentType: String,
        imageBase64: String,
      },
    ],
    Role: {
      type: String,
      default: "Admin",
    },
  })
);

exports.Admin = Admin;
