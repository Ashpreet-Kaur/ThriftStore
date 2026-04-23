const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "retrend_db",
  multipleStatements: true,
});

module.exports = connection;
