const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    website: { type: String, required: true },
    metadata: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
    },
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
