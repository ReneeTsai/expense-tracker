// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const { sum } = require("../../function/sum");
// 準備引入路由模組
router.get("/", (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: "asc" })
    .then((records) => res.render("index", { records }))
    .catch((error) => console.error(error));
});

module.exports = router;
