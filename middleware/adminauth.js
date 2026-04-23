const connection = require("../mysql_connect");

function requireSuperadmin(req, res, next) {
  console.log("Checking session in requireSuperadmin:", req.session);

  if (!req.session.adminId || req.session.adminRole !== "superadmin") {
    console.log("Unauthorized access - redirecting to /admin_login");
    return res.redirect("/admin_login");
  }
  next();
}

module.exports = { requireSuperadmin };
