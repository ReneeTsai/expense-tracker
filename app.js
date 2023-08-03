// 載入 express 並建構應用程式伺服器
const express = require("express");
const session = require("express-session");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
require("./config/mongoose");
//views
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const dateFormat = require("handlebars-dateformat");
const usePassport = require("./config/passport");
app.engine("handlebars", exphbs({ defaultLayout: "main", extname: ".handlebars" }));
Handlebars.registerHelper("dateFormat", dateFormat);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "handlebars");
app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);
usePassport(app);
app.use(flash());
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});
app.use(methodOverride("_method"));
app.use(routes);

// 設定 port 3000
app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
