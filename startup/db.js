const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/inventory-application")
    .then(() => {
      console.log("Mongodb database connection is ok");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
