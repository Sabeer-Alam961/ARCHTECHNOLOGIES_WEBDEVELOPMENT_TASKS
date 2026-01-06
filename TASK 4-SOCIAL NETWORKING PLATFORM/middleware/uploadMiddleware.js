const { upload } = require('../config/cloudinary');

/**
 * Middleware to handle single image upload
 * Expects a field named 'image' or 'avatar'
 */
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Error uploading image: ' + err.message
                });
            }
            next();
        });
    };
};

module.exports = { uploadSingle };
