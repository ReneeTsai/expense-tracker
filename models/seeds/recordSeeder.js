const Record = require("../record"); // 載入 todo model
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const SEED_RECORD = require("../../data/seedRecord.json");
const db = require("../../config/mongoose");
const category = require("../category");
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", async () => {
  console.log("mongodb connected!");
  try {
    // 取得所有的 category 資料
    const categories = await category.find().lean();

    // 將 SEED_RECORD 轉換成一個物件陣列
    const records = SEED_RECORD.map((record) => {
      // 找到對應的 categoryId
      const category = categories.find((category) => category.name === record.category);
      if (category) {
        const categoryId = category._id;
        return {
          name: record.name,
          amount: record.amount,
          categoryId,
          date: record.date,
        };
      }
    });

    // 使用 create 方法將資料寫入資料庫
    await Record.create(records);
    console.log("done");
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
});
