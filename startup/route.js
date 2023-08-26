var bodyParser = require("body-parser");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/admin-register", require("../routes/admin/AdminRegister"));
  app.use("/employee-Register", require("../routes/employee/EmployeeRegister"));
  app.use("/admin-login", require("../routes/admin/AdminLogin"));
  app.use("/employee-login", require("../routes/employee/EmployeeLogin"));
};
