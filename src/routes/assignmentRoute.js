const express = require('express');
const path = require('path');
const upload = require('../utils/multerConfig');
const File = require('../models/File');

const router = express.Router();


router.post('/upload', upload.single('assignment'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }


        const newFile = new File({
            fileName: req.file.originalname,
            filePath: `/uploads/${req.file.filename}`,
        });

        await newFile.save();

        return res.status(200).json({
            message: 'File uploaded successfully',
            file: newFile,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
});

// teacher view
router.get('/files/:id', async (req, res) => {
    try {
        // id bata khojeko
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        return res.sendFile(path.resolve(__dirname, '../../', file.filePath));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while fetching the file' });
    }
});

module.exports = router;
