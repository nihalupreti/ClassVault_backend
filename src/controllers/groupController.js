const Group = require("../models/Group");
const GroupMessage = require("../models/GroupMessage");
const StudentUser = require("../models/StudentUser");
const TeacherUser = require("../models/TeacherUser");
const sendSuccessResponse = require("../utils/response");

exports.createGroup = async (req, res, next) => {
  const { groupName, groupTag } = req.body;

  try {
    const createGroup = new Group({
      groupName,
      groupTag,
      groupAdmin: req.user.userId,
    });
    const savedGroup = await createGroup.save();
    if (savedGroup) {
      const teacher = await TeacherUser.findByIdAndUpdate(
        req.user.userId,
        { $push: { groups: savedGroup._id } },
        { new: true }
      );
    }
    sendSuccessResponse(res, 201, {}, "Succesfully created group");
  } catch (err) {
    next(err);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    //TODO: add pagination here
    const allGroups = await Group.find();
    sendSuccessResponse(res, 200, allGroups, "All Groups");
  } catch (err) {
    next(err);
  }
};

exports.joinGroup = async (req, res, next) => {
  const { groupId } = req.body;
  try {
    //TODO: more validation here
    const student = await StudentUser.findByIdAndUpdate(
      req.user.userId,
      { $push: { groups: groupId } },
      { new: true } // Returns the updated document
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    sendSuccessResponse(res, 200, groupId, "Added to the group");
  } catch (err) {
    next(err);
  }
};

exports.getSingleGroup = async (req, res, next) => {};

exports.hasUserJoined = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    if (req.user.role !== "admin") {
      const student = await StudentUser.findById(req.user.userId);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const hasJoined = student.groups.includes(groupId);

      if (!hasJoined) {
        return res
          .status(403)
          .json({ message: "You are not enrolled in this group" });
      }
    }
    sendSuccessResponse(res, 200, groupId, "Yes");
  } catch (err) {
    next(err);
  }
};

exports.getGroupMessage = async (req, res, next) => {
  const { groupId } = req.params;
  const messages = await GroupMessage.find({ group: groupId }).populate(
    "user",
    "fullName"
  );
  const response = messages.map((msg) => {
    const date = new Date(msg.createdAt);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return {
      sender: msg.user.fullName,
      message: msg.message,
      time: formattedTime,
    };
  });
  sendSuccessResponse(res, 200, response, "messages..");
};
