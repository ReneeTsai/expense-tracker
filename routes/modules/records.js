const router = require("express").Router();
const Record = require("../../models/record");
const Category = require("../../models/category");
//新增支出
router.get("/new", async (req, res) => {
  const categories = await Category.find().lean();
  res.render("new", { categories });
});
router.post("/new", async (req, res) => {
  try {
    const { name, date, categoryId, amount } = req.body;
    const userId = req.user._id;
    return Record.create({
      userId,
      name,
      date,
      categoryId,
      amount,
    })
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
});
//編輯支出
router.get("/:id/edit", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const _id = req.params.id;
    const userId = req.user._id;
    const record = await Record.findOne({ _id, userId }).lean();
    const category = await Category.findOne({ _id: record.categoryId }).lean();
    record.category = category.name;
    record.date = new Date(record.date).toISOString().slice(0, 10);
    res.render("edit", { categories, record });
  } catch (err) {
    console.log(err);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const userId = req.user._id;
    const { name, date, categoryId, amount } = req.body;
    return Record.findOneAndUpdate(
      { _id, userId },
      {
        name,
        date,
        categoryId,
        amount,
      }
    )
      .then((updatedRecord) => res.redirect(`/records/${updatedRecord._id}/edit`))
      .then(req.flash("success_msg", "編輯成功!"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
});
//刪除支出
router.delete("/:id", (req, res) => {
  const _id = req.params.id;
  const userId = req.user._id;
  return Record.findByIdAndDelete(_id, userId)
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});
module.exports = router;
