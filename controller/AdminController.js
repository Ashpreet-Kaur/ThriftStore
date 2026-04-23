const connection = require("../mysql_connect");
const { connect } = require("../route");

class AdminAccount {
  admin_login(req, res) {
  console.log("reaches at login point");

  if (req.method === "GET") {
    return res.render("admin/admin_login.ejs");
  }

  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM user_image WHERE email = ? AND user_role = 'superadmin'",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("Database error");

      if (results.length === 0) {
        return res.render("admin/admin_login.ejs", {
          message: "Invalid credentials",
        });
      }

      const admin = results[0];

      if (password === admin.password) {
        // Use separate session variables for admin
        req.session.adminId = admin.id;
        req.session.adminEmail = admin.email;
        req.session.adminRole = admin.user_role;

        req.session.save((err) => {
          if (err) {
            console.log("Session save error:", err);
            return res.send("Error saving session");
          }

          console.log("Admin session:", req.session);
          return res.redirect("/admin/admin_dashboard");
        });
      } else {
        return res.render("admin/admin_login.ejs", {
          message: "Invalid credentials",
        });
      }
    }
  );
}


  //for cards
  getDashboard(req, res) {
    const email = req.session.adminEmail;

    const role = req.session.adminRole;
if (role !== "superadmin") {
  return res.redirect("/admin_login");  // or res.send("Unauthorized")
}

const queries = {
          pendingSellers:
            "SELECT COUNT(*) AS count FROM seller_requests WHERE status = 'pending'",
          pendingClothes:
            "SELECT COUNT(*) AS count FROM clothes WHERE status = 'pending'",
          registeredUsers:
            "SELECT COUNT(*) AS count FROM user_image WHERE user_role = 'user' || user_role = 'admin' ",
          registeredSellers:
            "SELECT COUNT(*) AS count FROM user_image WHERE user_role = 'admin'",
        };

        let data = {};
        let completed = 0;
        const totalQueries = Object.keys(queries).length;

        for (let key in queries) {
          connection.query(queries[key], (err, results) => {
            if (err) return res.send("Error in fetching dashboard data");

            data[key] = results[0].count;
            completed++;

            if (completed === totalQueries) {
              res.render("admin/admin_dashboard", {
                ...data,
              });
            }
          });
        }
      
  
  }

  list_seller_requests(req, res) {
    const email = req.session.adminEmail;

    connection.query(
      "SELECT user_role FROM user_image WHERE email = ?",
      [email],
      (err, result) => {
        if (err || result[0].user_role !== "superadmin")
          return res.send("Unauthorized");

        connection.query(
          "SELECT sr.user_id, ui.email, sr.created_at FROM seller_requests sr JOIN user_image ui ON sr.user_id = ui.id WHERE sr.status = 'pending'",
          (err, requests) => {
            if (err) return res.send("Error fetching requests");
            res.render("admin/seller_requests.ejs", { requests }); // ✅ This is correct
          }
        );
      }
    );
  }

  getSellerApprovals(req, res) {
    // Only allow if current user is superadmin
    const email = req.session.adminEmail;
    connection.query(
      "SELECT user_role FROM user_image WHERE email = ?",
      [email],
      (err, result) => {
        if (result[0].user_role !== "superadmin")
          return res.send("Unauthorized");

        connection.query(
          "SELECT * FROM seller_requests WHERE status = 'pending'",
          (err, requests) => {
            if ((err, requests)) return res.send("Error fetching requests");
            res.render("admin/seller_requests", { requests });
          }
        );
      }
    );
  }

  approveSeller(req, res) {
    const { user_id } = req.body;

    connection.getConnection((err, conn) => {
      if (err) return res.send("DB error");

      conn.beginTransaction((err) => {
        if (err) return res.send("Transaction error");

        conn.query(
          "UPDATE user_image SET user_role = 'admin' WHERE id = ?",
          [user_id],
          (err) => {
            if (err) return conn.rollback(() => res.send("Update failed"));

            conn.query(
              "UPDATE seller_requests SET status = 'approved' WHERE user_id = ?",
              [user_id],
              (err) => {
                if (err)
                  return conn.rollback(() => res.send("Status update failed"));

                conn.commit((err) => {
                  conn.release();
                  if (err) return res.send("Commit failed");
                  res.redirect("/admin/seller_requests");
                });
              }
            );
          }
        );
      });
    });
  }
  reject_seller(req, res) {
    const { user_id } = req.body;

    connection.query(
      "UPDATE seller_requests SET status = 'rejected' WHERE user_id = ?",
      [user_id],
      (err) => {
        if (err) return res.send("Rejection failed");
        res.redirect("/admin/seller_requests");
      }
    );
  }

  listPendingClothes(req, res) {
    const email = req.session.adminEmail;
    connection.query(
      "SELECT * FROM clothes WHERE status = 'pending'",
      (err, clothes) => {
        if (err) return res.send("Error fetching pending clothes");
        res.render("admin/pending_clothes.ejs", { clothes });
      }
    );
  }

  approveCloth(req, res) {
    const { cloth_id } = req.body;
    connection.query(
      "UPDATE clothes SET status = 'approved' WHERE cloth_id = ?",
      [cloth_id],
      (err) => {
        if (err) return res.send("Approval failed");
        res.redirect("/admin/pending_clothes");
      }
    );
  }

  rejectCloth(req, res) {
    const { cloth_id } = req.body;
    connection.query(
      "UPDATE clothes SET status = 'rejected' WHERE cloth_id = ?",
      [cloth_id],
      (err) => {
        if (err) return res.send("Rejection failed");
        res.redirect("/admin/pending_clothes");
      }
    );
  }

getProducts(req,res){
  const query = 'SELECT * FROM clothes WHERE status = "approved"';
  connection.query(query, (err, results) => {
    if (err) {
      return res.send('Error fetching products: ' + err);
    }
    res.render('admin/products_list', { products: results });
  });
}

  viewProductDetails(req, res) {
    const id = req.params.id;
    const query = "SELECT * FROM clothes WHERE cloth_id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return res.send(err);
      if (results.length === 0) return res.status(404).send("Product not found");
      res.render("admin/product_detail", { product: results[0] });
    });
  
}

deleteProduct(req, res) {
    const id = req.params.id;
    const deleteQuery = "DELETE FROM clothes WHERE cloth_id = ?";
    connection.query(deleteQuery, [id], (err, result) => {
      if (err) return res.send(err);
      res.redirect("/admin/products");
    });
  }

 

}

const obj = new AdminAccount();

module.exports = obj;
