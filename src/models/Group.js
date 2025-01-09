const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherUser",
  },
  groupTag: {
    type: String,
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
