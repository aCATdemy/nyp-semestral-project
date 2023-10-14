const multer = require('multer');
const path = require('path');
// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/video/' + req.user.id + '/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.id + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /mp4|MPEG-4|mkv/;
    // Test extension
    const extname =
        filetypes.test(path.extname(file.originalname).toLowerCase());
    // Test mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true);
    }
    else {
        callback({ message: 'Videos Only' });
    }
}
// Define Upload Function
const videoUpload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 1MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('videoUpload'); // Must be the name as the HTML file upload input
module.exports = videoUpload;