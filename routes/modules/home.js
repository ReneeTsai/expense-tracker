// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const Record = require("../../models/record");
const Category = require("../../models/category")
const { sum } = require("../../function/sum");
// 準備引入路由模組
router.get("/", async (req, res) => {
 try {
  Record.find()
  .lean()
  .sort({ _id: "asc" })
  .then((records) => {
    // 將日期格式進行轉換
    records.forEach((record) => {
      record.date = new Date(record.date).toLocaleDateString();
    });
    res.render("index", { records ,sum: sum(records)})
  })
 }catch (err) {
  console.log(err)
}
})
// 選取特定類別的紀錄
router.get("/search", async (req, res) => {
  const category = req.query.category
  try {
    const categoryWithId = await Category.findOne({ name: category }) .lean()
    const records = await Record.find({ categoryId: categoryWithId._id}) .lean()
    const sortedRecords = await Promise.all(records.map(async record => {
    return {
      ...record,
      date: new Date(record.date).toLocaleDateString(),
      image: categoryWithId.icon
    }}))
    res.render("index", { records: sortedRecords, sum: sum(records) })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
