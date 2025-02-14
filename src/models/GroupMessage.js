const mongoose = require("mongoose");

const groupMessageSchema = mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: "string",
    },
  },
  { timestamps: true }
);

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;
