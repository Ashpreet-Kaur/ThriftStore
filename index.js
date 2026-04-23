const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const route = require("./route");
const mysession = require("express-session");

// Serve static files
app.use('/public', express.static('public'));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Set EJS as templating engine
app.set("view engine", "ejs");

// Session middleware
app.use(
  mysession({
    secret: "useraddress",
    resave: false,              // 🔄 Better to keep false to avoid unnecessary session saves
    saveUninitialized: false,   // 🔒 Prevent saving empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60,   // ⏰ 1 hour for better testing (optional)
    },
  })
);

// Optional: Keep session active during activity
app.use((req, res, next) => {
  if (req.session) {
    req.session.touch();
  }
  next();
});

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session.user || null;
  next();
});

// Use routes
app.use("/", route);

// Start server
const port = 2211;
app.listen(port, () => {
  console.log(`click here: http://localhost:${port}`);
});
