const connection = require("../mysql_connect");

function requireUserAuth(req, res, next) {
  if (!req.session || !req.session.emailid || !req.session.userid) {
    return res.redirect("/login");
  }

  next();
}

function requireSellerRole(req, res, next) {
  if (!req.session.emailid) {
    console.log("User not logged in");
    return res.redirect("/login");
  }

  const email = req.session.emailid;

  connection.query(
    "SELECT user_role, id FROM user_image WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error checking the role");
      }

      if (results.length === 0) {
        console.log("User not found in database");
        return res.redirect("/login");
      }

      const user_role = results[0].user_role;
      const userId = results[0].id;

      if (user_role === "seller" || user_role === "superadmin") {
        return next(); // Access granted
      }

      // Check seller request status
      connection.query(
        "SELECT status FROM seller_requests WHERE user_id = ?",
        [userId],
        (err, requestResults) => {
          if (err) {
            console.error("Error checking seller request:", err);
            return res.status(500).send("Error checking seller request");
          }

          if (requestResults.length === 0) {
            // No request submitted
            return res.redirect("/request-seller");
          }

          const status = requestResults[0].status;

          if (status === "approved") {
            // Update role to 'seller'
            connection.query(
              "UPDATE user_image SET user_role = 'seller' WHERE id = ?",
              [userId],
              (err) => {
                if (err) {
                  console.error("Error updating role:", err);
                  return res.status(500).send("Error upgrading role");
                }
                return next(); // Access granted after upgrade
              }
            );
          } else {
            // Pending or rejected → show status page
            return res.redirect("/request-status");
          }
        }
      );
    }
  );
}

module.exports = { requireUserAuth, requireSellerRole };
