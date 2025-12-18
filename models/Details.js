// const mongoose = require("mongoose");

// const detailsSchema = new mongoose.Schema({
//   goodsName: String,
//   quantity: String,
//   transportName: String,
//   transportNumber: String,
//   receiverName: String,
//   receiverNumber: String,
//   date: String,
// });

// module.exports = mongoose.model("Details", detailsSchema, "Details");



const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
  goodsName: String,
  quantity: String,
});

const detailsSchema = new mongoose.Schema({
  goods: [goodsSchema],   // <-- Array of goods
  transportName: String,
  transportNumber: String,
  receiverName: String,
  receiverNumber: String,
  date: String,
});

module.exports = mongoose.model("Details", detailsSchema, "Details");
