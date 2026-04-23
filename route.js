const express = require("express");
const route = express.Router();
const connection = require("./mysql_connect");
const multer = require("multer"); //for image storage
const path = require("path"); //to get image path
const admin_obj = require("./controller/AdminController");
const user_obj = require("./controller/UserController");
const { callbackify } = require("util");
const { requireUserAuth, requireSellerRole } = require("./middleware/auth");
const { requireSuperadmin } = require("./middleware/adminauth");

var userProfileStorage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, "./public/user_image");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var uploadUserProfile = multer({
  storage: userProfileStorage,
});

const productImageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/product_images"); // separate folder for clothes
  },
  filename: (req, file, callback) => {
    const uniqueName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    callback(null, uniqueName);
  },
});

// Multer middleware for clothing images
const uploadProductImage = multer({
  storage: productImageStorage,
});
route.post("/user/register", uploadUserProfile.single("photo"), (req, res) => {
  user_obj.user_registration(req, res);
});

route.get("/", (req, res) => {
  user_obj.homePage(req,res);
});

route.get("/admin_login", (req, res) => {
  admin_obj.admin_login(req, res);
});
route.post("/admin_login", (req, res) => {
  admin_obj.admin_login(req, res);
});
route.get("/about", (req, res) => {
  res.render("user/about.ejs");
});
route.post("/cart/add/:id", (req, res) => {
  user_obj.addToCart(req, res);
});
route.get("/cart", (req, res) => {
  user_obj.viewCart(req, res);
});

route.post("/cart/delete/:id", (req, res) => {
  user_obj.removeFromCart(req, res);
});


route.get("/contact", (req, res) => {
  res.render("user/contact.ejs");
});

route.use("/login", (req, res) => {
  user_obj.user_login(req, res);
});
route.get("/register", (req, res) => {
  res.render("user/register.ejs");
});

route.get("/buy", (req, res) => {
  user_obj.get_buy(req, res);
});

route.get("/profile", requireUserAuth, (req, res) => {
  user_obj.user_profile(req, res);
});

// Show change password form
route.get("/change_password", requireUserAuth, (req, res) => {
  user_obj.change_password(req, res);
});

// Handle password change form submission
route.post("/change_password", requireUserAuth, (req, res) => {
  user_obj.update_password(req, res);
});

// Show edit profile form
route.get("/edit_profile", requireUserAuth, (req, res) => {
  user_obj.edit_profile(req, res);
});

// Handle profile update
route.post("/edit_profile", requireUserAuth, uploadUserProfile.single("photo"), (req, res) => {
  user_obj.update_profile(req, res);
});

route.get("/user_dashboard", requireUserAuth, (req, res) => {
  user_obj.user_dashboard(req, res);
});

route.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err);
      return res.redirect("/user_dashboard");
    }
    res.redirect("/login");
  });
});

route.get("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err);
      return res.redirect("/admin_login");
    }
    res.redirect("/admin_login");
  });
});

// Show Sell Form
route.get("/sell", requireSellerRole, (req, res) => {
  res.render("user/sell", { message: null });
});

// Handle Sell Form Submission
route.post("/sell", requireSellerRole, uploadProductImage.single("image"), (req, res) => {
  user_obj.sell_clothes(req, res);
});

// Show Seller Access Request Form
route.get("/request-seller", requireUserAuth, (req, res) => {
  user_obj.getSellerRequestPage(req, res);
});

// Handle Seller Access Request Submission
route.post("/request-seller", requireUserAuth, (req, res) => {
  user_obj.submitSellerRequest(req, res);
});

// // View Seller Request Status
route.get("/request-status", requireUserAuth, (req, res) => {
  user_obj.getSellerRequestPage(req, res);
});

// Admin: View Pending Requests
route.get("/admin/seller_requests", requireSuperadmin, (req, res) => {
  admin_obj.list_seller_requests(req, res);
});

route.get("/admin/products", requireSuperadmin, (req,res)=>{
  admin_obj.getProducts(req,res);
})

route.post("/admin/products/delete/:id", requireSuperadmin, (req,res)=>{
  admin_obj.deleteProduct(req,res);
})

// // Admin: Approve Seller
route.post("/admin/approve-seller", requireSuperadmin, (req, res) => {
  admin_obj.approveSeller(req, res);
});

// // Admin: Reject Seller
route.post("/admin/reject-seller", requireSuperadmin, (req, res) => {
  admin_obj.reject_seller(req, res);
});

// admin: view pending clothes
route.get("/admin/pending_clothes", requireSuperadmin, (req, res) => {
  admin_obj.listPendingClothes(req, res);
});

//admin: approve clothes
route.post("/admin/approve-cloth", requireSuperadmin, (req, res) => {
  admin_obj.approveCloth(req, res);
});

//admin: reject clothes
route.post("/admin/reject-cloth", requireSuperadmin, (req, res) => {
  admin_obj.rejectCloth(req, res);
});

//for admin dashboard cards
route.get("/admin/admin_dashboard", requireSuperadmin, (req, res) => {
  admin_obj.getDashboard(req, res);
});

//for displaying product
route.get("/view_product/:id", (req, res) => {
  user_obj.view_product(req, res);
});

route.get("/debug-session", (req, res) => {
  res.json(req.session);
});

route.get("/return_policy", (req,res)=>{
  res.render("return_policy")
})

route.get("/shipping", (req,res)=>{
  res.render("shippingDelivery.ejs" )
})

route.get("/settings", requireUserAuth, (req,res)=>{
  user_obj.settings(req,res)
})

// route.get("/shipping_address", (req,res)=>{
//     console.log("Session data:", req.session); // Add this
//   user_obj.getShippingAddress(req,res)

// })

route.get("/addAddress", requireUserAuth, (req,res)=>{
  user_obj.getAddAddressPage(req,res)
})

route.post("/addAddress", requireUserAuth, (req,res)=>{
  user_obj.addAddress(req,res)
})

route.get("/my_listings", requireUserAuth, (req, res) => {
  user_obj.my_listings(req, res);
});

route.post("/delete_listing/:id", requireUserAuth, (req, res) => {
  user_obj.delete_listing(req, res);
});

route.get("/edit_listing/:id", requireUserAuth, (req, res) => {
  user_obj.edit_listing_form(req, res);
});


route.post("/edit_listing/:id", requireUserAuth, uploadProductImage.single("image"), (req, res) => {
  user_obj.update_listing(req, res);
});

route.get("/checkout", requireUserAuth, (req,res)=>{
  user_obj.checkout(req,res)
})

route.get("/success_payment_page", requireUserAuth, (req,res)=>{
  user_obj.Show_Success_Payment_Page(req,res);
})

route.post("/success_payment", requireUserAuth, (req,res)=>{
  user_obj.successPayment(req,res)
})


module.exports = route;
