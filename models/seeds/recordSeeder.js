const Record = require("../record"); // 載入 todo model
const User = require("../user");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const SEED_RECORD = require("../../data/seedRecord.json");
const db = require("../../config/mongoose");
const bcrypt = require("bcryptjs");
const category = require("../category");
const SEED_USER = {
  name: "廣志",
  email: "user1@example.com",
  password: "123456789",
};

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
    // create seed data
    const hash = await bcrypt.hash(SEED_USER.password, await bcrypt.genSalt(10));
    const user = await User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash,
    });
    for (const record of records) {
      record.userId = user._id;
      await Record.create(record);
      console.log("done");
    }
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
});
