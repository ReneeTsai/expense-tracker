const mongoose = require("mongoose");
const Record = require("../record"); // 載入 todo model
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const SEED_RECORD = require("../../data/seedRecord.json");
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
  // 將 SEED_RECORD 轉換成一個物件陣列
  const records = SEED_RECORD.map((record) => ({
    name: record.name,
    category: record.category,
    amount: record.amount,
  }));

  // 使用 create 方法將資料寫入資料庫
  Record.create(records)
    .then(() => {
      console.log("done");
      db.close();
    })
    .catch((error) => console.log(error));
});
