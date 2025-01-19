const File = require("../models/File");

const handleFileUploads = async (files, uploadPath) => {
    if (!files || files.length === 0) return null;

    const filesData = files.map((file) => ({
        fileName: file.originalname,
        filePath: `/uploads/${uploadPath}/${file.filename}`,
    }));

    const insertedFile = await File.insertMany(filesData);
    return insertedFile[0]._id; // file id which was inserted at first
};

module.exports = handleFileUploads;
