const mongoose = require("mongoose");

const teacherUserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    employeeCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    faculty: {
        type: String,
        enum: ["BCE", "BCA"],
        required: true,
    },
    assignedSubjects: {
        type: [{ courseName: String, semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" } }],
        default: [], // subjects
    },
    dateOfJoining: {
        type: Date,
        required: true,
        default: Date.now,
    },
    contactNumber: {
        type: String,
        match: [/^\d{10}$/, "Please enter a valid 10-digit contact number"],
    },
});

const TeacherUser = mongoose.model("TeacherUser", teacherUserSchema);

module.exports = TeacherUser;
