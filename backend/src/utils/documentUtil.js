// Helper function to handle file uploads
const handleFileUploads = async (files, documentNames = []) => {
  const uploadedFiles = {};

  if (files.logoImage) {
    uploadedFiles.logoImage = files.logoImage[0].path;
  }

  if (files.coverImage) {
    uploadedFiles.coverImage = files.coverImage[0].path;
  }

  if (files.businessPhotos) {
    uploadedFiles.businessPhotos = files.businessPhotos.map(
      (photo) => photo.path
    );
  }

  if (files.documents) {
    uploadedFiles.documents = files.documents.map((doc, index) => ({
      originalName: doc.originalname,
      documentName: documentNames[index] || doc.originalname,
      fileType: getFileTypeFromMimetype(doc.mimetype),
      size: doc.size,
      url: doc.path,
    }));
  }

  return uploadedFiles;
};

// Helper function to get file type from mimetype
const getFileTypeFromMimetype = (mimetype) => {
  const mimeTypeMap = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/jpg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "text/plain": "TXT",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
  };
  return mimeTypeMap[mimetype] || mimetype;
};

module.exports = {
  handleFileUploads,
  getFileTypeFromMimetype,
};
