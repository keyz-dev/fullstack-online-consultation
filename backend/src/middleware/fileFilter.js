const ALLOWED_RESUME_TYPES = {
    // Document formats
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
};

// Resume file filter
const documentFilter = (req, file, cb) => {
    if (Object.keys(ALLOWED_RESUME_TYPES).includes(file.mimetype) || file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid document format'), false);
    }
};

module.exports = documentFilter