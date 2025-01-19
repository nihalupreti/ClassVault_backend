const multer = require("multer");
const path = require("path");

// Define the storage configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check if it's a teacher's note or a student's assignment
        if (req.body.type === 'teacher') {
            cb(null, './uploads/teacherNotes');
        } else if (req.body.type === 'student') {
            cb(null, './uploads/studentAssignments');
        } else {
            cb(new Error("Invalid file type"), false);
        }
    },
    filename: function (req, file, cb) {
        // Use original file name, you can modify it as needed
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer
const upload = multer({ storage: storage });

module.exports = upload;
