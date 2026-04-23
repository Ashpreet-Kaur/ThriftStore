const connection = require("../mysql_connect");
const { connect } = require("../route");

function getGuestCart(req) {
  if (!Array.isArray(req.session.guestCart)) {
    req.session.guestCart = [];
  }

  return req.session.guestCart;
}

function mergeGuestCartIntoUserCart(userId, guestCart, callback) {
  if (!Array.isArray(guestCart) || guestCart.length === 0) {
    return callback();
  }

  connection.getConnection((err, db) => {
    if (err) {
      return callback(err);
    }

    const mergeNext = (index) => {
      if (index >= guestCart.length) {
        db.release();
        return callback();
      }

      const entry = guestCart[index];
      const productId = Number(entry.productId);
      const quantity = Math.max(1, Number(entry.quantity) || 1);

      db.query(
        "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, productId],
        (selectErr, rows) => {
          if (selectErr) {
            db.release();
            return callback(selectErr);
          }

          if (rows.length > 0) {
            db.query(
              "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
              [quantity, userId, productId],
              (updateErr) => {
                if (updateErr) {
                  db.release();
                  return callback(updateErr);
                }

                mergeNext(index + 1);
              }
            );

            return;
          }

          db.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [userId, productId, quantity],
            (insertErr) => {
              if (insertErr) {
                db.release();
                return callback(insertErr);
              }

              mergeNext(index + 1);
            }
          );
        }
      );
    };

    mergeNext(0);
  });
}

function buildGuestCartItems(req, callback) {
  const guestCart = getGuestCart(req);

  if (guestCart.length === 0) {
    return callback(null, []);
  }

  const productIds = guestCart.map((item) => Number(item.productId));

  connection.query(
    "SELECT cloth_id, itemName, image, price FROM clothes WHERE cloth_id IN (?)",
    [productIds],
    (err, rows) => {
      if (err) {
        return callback(err);
      }

      const quantityByProductId = new Map(
        guestCart.map((item) => [Number(item.productId), Math.max(1, Number(item.quantity) || 1)])
      );

      const items = rows.map((row) => ({
        id: row.cloth_id,
        product_id: row.cloth_id,
        itemName: row.itemName,
        image: row.image,
        price: row.price,
        quantity: quantityByProductId.get(Number(row.cloth_id)) || 1,
        isGuestCartItem: true,
      }));

      callback(null, items);
    }
  );
}

class Account {

 

  user_registration(req, res) {
    if (req.method === "GET") {
      res.render("user/register");
    } else {
      connection.getConnection((err, myconnect) => {
        if (err) {
          res.send(err);
        } else {
          const { name, email, gender, mobile, address, password } = req.body;
          const photo = req.file ? req.file.filename : null;

          try {
            const check_email = `SELECT * from user_image where email='${req.body.email}'`;
            myconnect.query(check_email, [email], async (err, record) => {
              if (err) {
                myconnect.release();
                return res.send(err);
              }

              if (record.length > 0) {
                myconnect.release();
                return res.render("user/register", {
                  result: req.body.email + " Already Registred",
                });
              } else {
                const query = `INSERT INTO user_image ( name, email, password, mobile, gender, address, photo, status, user_role, created_at)VALUES (?,?, ?, ?, ?, ?, ?, ?, ?,?
                )`;

                const values = [
                  name,
                  email,
                  password,
                  mobile,
                  gender,
                  address,
                  photo,
                  1,
                  "user",
                  new Date(),
                ];
                myconnect.query(query, values, (err) => {
                  myconnect.release();
                  if (err) {
                    return res.send(err);
                  } else {
                    return res.render("user/register", {
                      result:
                        "Registered Successfully. Please login to continue.",
                    });
                  }
                });
              }
            });
          } catch (error) {
            myconnect.release();
            return res.send("An error occurred: " + error.message);
          }
        }
      });
    }
  }
  user_login(req, res) {
    if (req.method == "GET") {
      res.render("user/login");
    } else {
      const { email, password } = req.body;
      connection.getConnection((err, connect) => {
        if (err) {
          return res.status(500).send("Database connection Error");
        }
        const query =
          "Select * from user_image WHERE email = ? AND password = ?";
        connect.query(query, [email, password], (err, result) => {
          connect.release();

          if (err) {
            return res.status(500).send("Query Error");
          }

          if (result.length > 0) {
            const user = result[0];
            if (user.status === 1) {
              req.session.userid = user.id;
              req.session.emailid = email;
              req.session.username = user.name;
              req.session.useraddress = user.address;
              req.session.role = user.role;
                  req.session.user = user;

              mergeGuestCartIntoUserCart(
                user.id,
                req.session.guestCart,
                (mergeErr) => {
                  if (mergeErr) {
                    console.error("Guest cart merge error:", mergeErr);
                    return res.status(500).send("Error restoring your cart");
                  }

                  delete req.session.guestCart;
                  res.redirect("/user_dashboard");
                }
              );
            } else {
              res.render("user/blockuser");
            }
          } else {
            res.render("user/login", { message: "Invalid credentials" });
          }
        });
      });
    }
  }
homePage(req, res) {
  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    const featuredQuery = "SELECT * FROM clothes WHERE status = 'approved' ORDER BY created_at DESC LIMIT 24";
    const newArrivalsQuery = "SELECT * FROM clothes WHERE status = 'approved' ORDER BY cloth_id DESC LIMIT 24";
    const discountedQuery = `
      SELECT * FROM clothes
      WHERE status = 'approved' AND new_price IS NOT NULL AND new_price < price
      ORDER BY created_at DESC
      LIMIT 24
    `;

    connect.query(featuredQuery, (err, featuredProducts) => {
      if (err) {
        connect.release();
        console.error("Featured Query Error:", err);
        return res.send("Failed to fetch featured products");
      }

      connect.query(newArrivalsQuery, (err, newArrivals) => {
        if (err) {
          connect.release();
          console.error("New Arrivals Error:", err);
          return res.send("Failed to fetch new arrivals");
        }

        connect.query(discountedQuery, (err, discountedProducts) => {
          connect.release(); 
          if (err) {
            console.error("Discounted Query Error:", err);
            return res.send("Error fetching discounted products");
          }

          res.render("user/home", {
            featuredProducts,
            newArrivals,
            discountedProducts,
            session: req.session,
          });
        });
      });
    });
  });
}




  my_listings(req, res) {
  if (!req.session.emailid) return res.redirect("/login");

  const email = req.session.emailid;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database error");

    const query = "SELECT * FROM clothes WHERE email = ? ORDER BY cloth_id DESC";

    connect.query(query, [email], (err, result) => {
      connect.release();
      if (err) return res.send("Failed to fetch user listings");

      res.render("user/my_listings", {
        clothes: result,
        session: req.session
      });
    });
  });
}

delete_listing(req, res) {
  if (!req.session.emailid) return res.redirect("/login");

  const email = req.session.emailid;
  const clothId = req.params.id;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database error");

    const query = "DELETE FROM clothes WHERE cloth_id = ? AND email = ?";

    connect.query(query, [clothId, email], (err, result) => {
      connect.release();
      if (err) {
        return res.send("Failed to delete listing");
      }
      res.redirect("/my_listings");
    });
  });
}

user_dashboard(req, res) {
  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    const featuredQuery = "SELECT * FROM clothes WHERE status = 'approved' LIMIT 8";
    const newArrivalsQuery = "SELECT * FROM clothes WHERE status = 'approved' ORDER BY cloth_id DESC LIMIT 8";
    const discountedQuery = `
      SELECT * FROM clothes
      WHERE status = 'approved' AND new_price IS NOT NULL AND new_price < price
      ORDER BY created_at DESC
      LIMIT 8
    `;

    connect.query(featuredQuery, (err, featuredProducts) => {
      if (err) {
        connect.release();
        console.error("Featured Query Error:", err);
        return res.send("Failed to fetch featured products");
      }

      connect.query(newArrivalsQuery, (err, newArrivals) => {
        if (err) {
          connect.release();
          console.error("New Arrivals Error:", err);
          return res.send("Failed to fetch new arrivals");
        }

        connect.query(discountedQuery, (err, discountedProducts) => {
          connect.release(); // ✅ Release at the end
          if (err) {
            console.error("Discounted Query Error:", err);
            return res.send("Failed to fetch discounted products");
          }

          // ✅ Pass discountedProducts too
          res.render("user/user_dashboard", {
            featuredProducts,
            newArrivals,
            discountedProducts,
            session: req.session
          });
        });
      });
    });
  });
}


edit_listing_form(req, res) {
  if (!req.session.emailid) return res.redirect("/login");

  const clothId = req.params.id;
  const email = req.session.emailid;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    const query = "SELECT * FROM clothes WHERE cloth_id = ? AND email = ?";
    connect.query(query, [clothId, email], (err, result) => {
      connect.release();
      if (err || result.length === 0) return res.send("Listing not found or unauthorized");

      res.render("user/edit_listing", { item: result[0] });
    });
  });
}

update_listing(req, res) {
  if (!req.session.emailid) return res.redirect("/login");

  const clothId = req.params.id;
  const email = req.session.emailid;
  const { ccondition, price, description } = req.body; // ✅ we already have `price` from form
  const image = req.file ? req.file.filename : null;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    let query, values;
    if (image) {
      query = `
        UPDATE clothes 
        SET ccondition = ?, new_price = ?, description = ?, image = ? 
        WHERE cloth_id = ? AND email = ?
      `;
      values = [ccondition, price, description, image, clothId, email]; 
    } else {
      query = `
        UPDATE clothes 
        SET ccondition = ?, new_price = ?, description = ? 
        WHERE cloth_id = ? AND email = ?
      `;
      values = [ccondition, price, description, clothId, email]; 
    }

    connect.query(query, values, (err, result) => {
      connect.release();
      if (err) {
        console.error("Update Error:", err);
        return res.send("Update failed");
      }
      res.redirect("/my_listings");
    });
  });
}



  settings(req, res) {
  if (!req.session.emailid) {
    return res.redirect("/login");
  }

  res.render("user/settings", {
    user: {
      name: req.session.username,
      email: req.session.emailid,
      address: req.session.useraddress,
    },
  });
}

  change_password(req, res) {
    if (!req.session.emailid) {
      return res.redirect("/login");
    }

    res.render("user/change_password", { message: null });
  }

  update_password(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const email = req.session.emailid;

    if (!email) return res.redirect("/login");

    connection.getConnection((err, conn) => {
      if (err) return res.send("Database connection error");

      const query = "SELECT password FROM user_image WHERE email = ?";
      conn.query(query, [email], (err, result) => {
        if (err) {
          conn.release();
          return res.send("Query error");
        }

        const user = result[0];
        if (!user || user.password !== currentPassword) {
          conn.release();
          return res.render("user/change_password", {
            message: "Incorrect current password",
          });
        }

        if (newPassword !== confirmPassword) {
          conn.release();
          return res.render("user/change_password", {
            message: "New passwords do not match",
          });
        }

        const updateQuery =
          "UPDATE user_image SET password = ? WHERE email = ?";
        conn.query(updateQuery, [newPassword, email], (err) => {
          conn.release();
          if (err) return res.send("Update error");
          return res.render("user/change_password", {
            message: "Password updated successfully",
          });
        });
      });
    });
  }
  edit_profile(req, res) {
    if (!req.session.emailid) {
      return res.redirect("/login");
    }

    connection.getConnection((err, conn) => {
      if (err) return res.send("DB error");

      const query = "SELECT * FROM user_image WHERE email = ?";
      conn.query(query, [req.session.emailid], (err, results) => {
        conn.release();
        if (err) return res.send("Query error");
        if (results.length === 0) return res.redirect("/login");

        const user = results[0];
        res.render("user/edit_profile", { user, message: null });
      });
    });
  }
  update_profile(req, res) {
    const { name, mobile, gender, address } = req.body;
    const email = req.session.emailid;

    const photo = req.file ? req.file.filename : null;

    if (!email) return res.redirect("/login");

    connection.getConnection((err, conn) => {
      if (err) return res.send("DB error");

      let query, values;

      if (photo) {
        query = `
        UPDATE user_image 
        SET name = ?, mobile = ?, gender = ?, address = ?, photo = ?
        WHERE email = ?`;
        values = [name, mobile, gender, address, photo, email];
      } else {
        query = `
        UPDATE user_image 
        SET name = ?, mobile = ?, gender = ?, address = ?
        WHERE email = ?`;
        values = [name, mobile, gender, address, email];
      }

      conn.query(query, values, (err) => {
        conn.release();
        if (err) return res.send("Update error");

        req.session.username = name;
        req.session.useraddress = address;

        res.redirect("/profile");
      });
    });
  }
  getShippingAddress = (req, res) => {
  const address = req.session.useraddress || null;
  if (!req.session.emailid) {
  return res.redirect("/login");
}
res.render("user/shipping_address", { address });
};
addAddress(req, res) {
  if (!req.session.emailid) {
    return res.redirect("/login");
  }

  const address = req.body.address;
  const email = req.session.emailid;

  connection.getConnection((err, conn) => {
    if (err) return res.send("DB connection error");

    const query = "UPDATE user_image SET address = ? WHERE email = ?";
    conn.query(query, [address, email], (err) => {
      conn.release();
      if (err) return res.send("Failed to update address");

    

      return res.render("user/shipping_address");
    });
  });
}

user_profile(req, res) {
  const email = req.session.emailid;
  if (!email) return res.redirect("/login");

  connection.query("SELECT * FROM user_image WHERE email = ?", [email], (err, results) => {
    if (err) return res.send("Database error");
    if (results.length === 0) return res.send("User not found");

    res.render("user/profile", { user: results[0], session: req.session });
  });
}


getAddAddressPage(req, res) {
  if (!req.session.emailid) {
    return res.redirect("/login");
  }

  res.render("user/add_address", { message: null });
}

getShippingAddress(req, res) {
  if (!req.session.emailid) return res.redirect("/login");

  const email = req.session.emailid;

  connection.getConnection((err, conn) => {
    if (err) {
      console.error("DB connection error:", err);
      return res.send("DB connection error");
    }

    const query = "SELECT name, address FROM user_image WHERE email = ?";
    conn.query(query, [email], (err, result) => {
      conn.release();
      if (err) {
        console.error("Query error:", err);
        return res.send("Failed to fetch address");
      }

      const user = result.length > 0 ? result[0] : null;
const address = user ? user.address : null;
      
      return res.render("user/shipping_address", { user, address });
    });
  });
}




  getSellerRequestPage(req, res) {
    const userId = req.session.userid;
    if (!userId) return res.redirect("/login");

    connection.query(
      "SELECT status FROM seller_requests WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return res.send("Database error");

        if (results.length > 0) {
          res.render("user/seller_request_status", {
            status: results[0].status,
            message: null,
          });
        } else {
          res.render("user/seller_request");
          message: null;
        }
      }
    );
  }

  submitSellerRequest(req, res) {
    const userId = req.session.userid;
    if (!userId) return res.redirect("/login");

    connection.query(
      "SELECT * FROM seller_requests WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return res.send("Error checking request");
        if (results.length > 0) return res.send("Request already submitted");

        connection.query(
          "INSERT INTO seller_requests (user_id, status) VALUES (?, 'pending')",
          [userId],
          (err) => {
            if (err) return res.send("Error submitting request");
            res.redirect("/request-status");
          }
        );
      }
    );
  }

  sell_clothes(req, res) {
    const {
      itemName,
      section,
      category,
      size,
      ccondition,
      price,
      description,
      status,
    } = req.body;
    const email = req.session.emailid;
    const image = req.file ? req.file.filename : null;

    if (!email) return res.redirect("/login");

    connection.getConnection((err, conn) => {
      if (err) return res.send("database connection error");

      const query = `INSERT into clothes (itemName, section, category, size, ccondition, price, description, image , email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;
      conn.query(
        query,
        [
          itemName,
          section,
          category,
          size,
          ccondition,
          price,
          description,
          image,
          email,
          "pending",
        ],
        (err) => {
          conn.release();
          if (err) return res.send("Error inserting data", err);

          res.render("user/sell", { message: "Item posted successfully" });
        }
      );
    });
  }

 buy_clothes(req, res) {

  if (!req.session.emailid) {
    return res.redirect("/login");
  }

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    const query = `SELECT * FROM clothes WHERE status = 'approved' ORDER BY id DESC`;

    connect.query(query, (err, results) => {
      connect.release();
      if (err) return res.send("Error fetching clothes");

      res.render("user/buy", {
        clothes: results,
        session: req.session
      });
    });
  });
}

  get_buy(req, res) {
    const sort = req.query.sort || "";
    const category = req.query.category || "";
    const subcategory = req.query.subcategory || "";
    const maxPrice = req.query.price ? parseInt(req.query.price) : null;

    const subcategoriesmap = {
      women: [
        "Tops",
        "Bottoms",
        "Dresses",
        "Jumpsuits",
        "Sarees",
        "Sports Shoes",
        "Accessories",
        "Ethnic Wear",
        "Handbags",
        "Kurtis",
        "Sandals",
        "Kurta Sets",
        "Jewelery",
      ],
      men: [
        "Topwear",
        "Bottomwear",
        "Casual Shoes",
        "Accessories",
        "Ethnic Wear",
        "Formal Wear",
        "Sunglasses",
        "Watches",
        "Sports Shoes",
      ],
      kids: ["Boys Clothing", "Girls Clothing", "Footwear", "Accessories"],
    };

    const subcategories = subcategoriesmap[category.toLowerCase()] || [];

    let orderBy = "created_at DESC";
    switch (sort) {
      case "price_asc":
        orderBy = "price ASC";
        break;
      case "price_desc":
        orderBy = "price DESC";
        break;
      case "name_asc":
        orderBy = "itemName ASC";
        break;
      case "name_desc":
        orderBy = "itemName DESC";
        break;
    }

    let where = [`status = 'approved' `];
    if (category)
      where.push(`LOWER(section) = LOWER(${connection.escape(category)})`);
    if (subcategory)
      where.push(`LOWER(category) = LOWER(${connection.escape(subcategory)})`);
    if (maxPrice) where.push(`price <= ${maxPrice}`);
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `SELECT * FROM clothes ${whereClause} ORDER BY ${orderBy}`;

    connection.query(query, (err, results) => {
      if (err) return res.status(500).send("Error loading products");
      res.render("user/buy", {
        clothes: results,
        sort,
        category,
        subcategory,
        subcategories,
      });
    });
  }

 view_product(req, res) {
  const clothId = req.params.id;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");

    const query = "SELECT * FROM clothes WHERE cloth_id = ?";
    connect.query(query, [clothId], (err, result) => {
      connect.release();
      if (err || result.length === 0) return res.send("Product not found");

      res.render("user/view_product", {
        product: result[0],
        session: req.session,
      });
    });
  });
}


  addToCart(req, res) {
  const product_id = req.params.id;
  const quantity = Math.max(1, parseInt(req.body.quantity || 1, 10));

  if (!req.session.emailid) {
    const guestCart = getGuestCart(req);
    const existingItem = guestCart.find(
      (item) => Number(item.productId) === Number(product_id)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      guestCart.push({ productId: Number(product_id), quantity });
    }

    return res.redirect("/cart");
  }

  const userEmail = req.session.emailid;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database connection error");
      const getUserQuery = "SELECT id FROM user_image WHERE email = ?";
      connect.query(getUserQuery, [userEmail], (err, userResult) => {
        if (err) {
          connect.release();
          return res.status(500).send("User lookup error");
        }

        if (userResult.length === 0) {
          connect.release();
          return res.status(404).send("User not found");
        }

        const userId = userResult[0].id;
        const checkQuery =
          "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
        connect.query(checkQuery, [userId, product_id], (err, result) => {
          if (err) {
            connect.release();
            return res.status(500).send("Query error");
          }

          if (result.length > 0) {
            const updateQuery =
              "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
            connect.query(
              updateQuery,
              [quantity, userId, product_id],
              (err) => {
                connect.release();
                if (err) return res.send("Error updating cart");
                res.redirect("/cart");
              }
            );
          } else {
            const insertQuery =
              "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
              console.log("Inserting to cart", { userId, product_id, quantity });
            connect.query(
              insertQuery,
              [userId, product_id, quantity],
              (err) => {
                connect.release();
                if (err) {
    console.error("Insert cart error:", err); // <-- see error in terminal
    return res.send("Error adding to cart: " + err.message); // <-- see error in browser
  }
                res.redirect("/cart");
              }
            );
          }
        });
      });
    });
  }

viewCart(req, res) {
  const email = req.session.emailid;

  if (!email) {
    return buildGuestCartItems(req, (guestErr, items) => {
      if (guestErr) {
        console.error("Guest cart query error:", guestErr);
        return res.send("Error fetching cart");
      }

      let total = 0;
      items.forEach((item) => {
        total += item.price * item.quantity;
      });

      res.render("user/cart", { items, total, guestMode: true });
    });
  }

  const userQuery = `SELECT id FROM user_image WHERE email = ?`;

  connection.query(userQuery, [email], (err, results) => {
    if (err || results.length === 0) {
      console.error("User lookup error:", err);
      return res.send("User not found");
    }

    const userId = results[0].id;

    const cartQuery = `
      SELECT cart.id AS id, cart.quantity, cart.product_id,
             clothes.itemName, clothes.image, clothes.price
      FROM cart
      JOIN clothes ON cart.product_id = clothes.cloth_id
      WHERE cart.user_id = ?
    `;

    connection.query(cartQuery, [userId], (err, items) => {
      if (err) {
        console.error("Cart query error:", err);
        return res.send("Error fetching cart");
      }

      let total = 0;
      items.forEach((item) => {
        total += item.price * item.quantity;
      });

      res.render("user/cart", { items, total, guestMode: false });
    });
  });
}




removeFromCart(req, res) {
  if (!req.session.emailid) {
    const productId = Number(req.params.id);
    req.session.guestCart = getGuestCart(req).filter(
      (item) => Number(item.productId) !== productId
    );

    return res.redirect("/cart");
  }

  const email = req.session.emailid;
  const cartId = req.params.id;

  connection.getConnection((err, connect) => {
    if (err) return res.send("Database error");

    const deleteQuery = `
      DELETE cart
      FROM cart
      JOIN user_image ON user_image.id = cart.user_id
      WHERE cart.id = ? AND user_image.email = ?
    `;

    connect.query(deleteQuery, [cartId, email], (err, result) => {
      connect.release();
      if (err) {
        console.error("Error deleting item:", err);
        return res.send("Error removing item from cart");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Cart item not found");
      }

      res.redirect("/cart");
    });
  });
}


checkout(req, res) {
  if (!req.session.emailid) {
    return res.redirect("/login");
  }

  const email = req.session.emailid;

  connection.getConnection((err, conn) => {
    if (err) return res.send("Database connection error");

    // Step 1: Get user_id using email
    const getUserIdQuery = "SELECT id FROM user_image WHERE email = ?";
    conn.query(getUserIdQuery, [email], (err, userResult) => {
      if (err || userResult.length === 0) {
        conn.release();
        return res.send("User not found");
      }

      const userId = userResult[0].id;

      // Step 2: Get cart items using user_id
      const cartQuery = `
        SELECT cart.*, clothes.itemName, clothes.description, clothes.image, clothes.price
        FROM cart
        JOIN clothes ON cart.product_id = clothes.cloth_id
        WHERE cart.user_id = ?
      `;

      conn.query(cartQuery, [userId], (err, items) => {
        conn.release();
        if (err) return res.send("Error fetching cart");

        let total = 0;
        items.forEach((item) => {
          total += item.price * item.quantity;
        });

        res.render("user/checkout", {
          items,
          total,
          name: req.session.username,
          email: req.session.emailid,
          address: req.session.useraddress,
        });
      });
    });
  });
}


successPayment(req,res){
  if (req.session.emailid != null && req.session.username != null) {
    connection.getConnection((err, myconnect) => {
      if (err) {
        return res.send(err);
      } else {
        const {
          payerid,
          merchantid,
          createtime,
          transactionid,
          amount,
          pqnty,
          pname,
          ptype,
          pphoto
        } = req.body;

        const buyeremail = req.session.emailid;
        const buyername = req.session.username;
        const buyeraddress = req.session.useraddress;

        const q = `INSERT INTO payments
          (product_name, product_type, quantity_order, product_image, buyer_name, buyer_email, buyer_address, payer_id, merchant_id, payment_trans_no, payed_amount, payment_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [pname, ptype, pqnty, pphoto, buyername, buyeremail, buyeraddress, payerid, merchantid, transactionid, amount, createtime];

        myconnect.query(q, values, (err) => {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            req.session.transactionId = transactionid;
            res.status(200).json({ success: true });
          }
        });
      }
    });
  } else {
    res.render('login', { message: "Login here...." });
  }
}

async Show_Success_Payment_Page(req,res){
   if (!req.session.username) {
    return res.redirect('/login');
  }

  const transactionId = req.session.transactionId;
  if (!transactionId) {
    return res.status(400).send("Transaction ID missing in session");
  }

  connection.getConnection((err, myconnect) => {
    if (err) {
      return res.status(500).send("Database connection error");
    }

    const q = "SELECT * FROM payments WHERE payment_trans_no = ?";
    myconnect.query(q, [transactionId], (err, results) => {
      if (err) {
        return res.status(500).send("Error fetching order details");
      }

      if (results.length === 0) {
        return res.status(404).send("Order not found");
      }

      const order = results[0];
      delete req.session.transactionId;
      res.render("user/success_payment", { order, name: req.session.username });
    });
  });
}
 
}

const obj = new Account();

module.exports = obj;
