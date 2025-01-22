const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueName}${extension}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept 
        } else {
            cb(new Error('Unsupported file type'), false); // Reject 
        }
    },
});

module.exports = upload;
