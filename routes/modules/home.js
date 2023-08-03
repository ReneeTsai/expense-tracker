// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category");
const { totalAmount } = require("../../function/totalAmount");
// 準備引入路由模組
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    Record.find({ userId })
      .lean()
      .sort({ date: "asc" })
      .then((records) => {
        // 將日期格式進行轉換
        records.forEach((record) => {
          record.date = new Date(record.date).toLocaleDateString();
        });
        res.render("index", { records, totalAmount: totalAmount(records) });
      });
  } catch (err) {
    console.log(err);
  }
});
// 選取特定類別的紀錄
router.get("/search", async (req, res) => {
  const category = req.query.category;
  const userId = req.user._id;
  try {
    const categoryWithId = await Category.findOne({ name: category }).lean();
    const records = await Record.find({ userId, categoryId: categoryWithId._id }).lean();
    const sortedRecords = await Promise.all(
      records.map(async (record) => {
        return {
          ...record,
          date: new Date(record.date).toLocaleDateString(),
          image: categoryWithId.icon,
        };
      })
    );
    res.render("index", { records: sortedRecords, totalAmount: totalAmount(records) });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
