const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      requried: true,
    },
  },
  {
    timestamps: true,
  }
);

const Msg = mongoose.model("msg", msgSchema);

module.exports = Msg;
