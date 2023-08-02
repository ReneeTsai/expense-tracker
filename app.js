// 載入 express 並建構應用程式伺服器
const express = require("express");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("./config/mongoose");
//views
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const dateFormat = require("handlebars-dateformat");
app.engine("handlebars", exphbs({ defaultLayout: "main", extname: ".handlebars" }));
Handlebars.registerHelper("dateFormat", dateFormat);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "handlebars");
app.use(methodOverride("_method"));
app.use(routes);

// 設定 port 3000
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
