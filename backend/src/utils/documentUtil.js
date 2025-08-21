// Helper function to handle file uploads for doctors and pharmacies
const handleFileUploads = async (files, documentNames = []) => {
  const uploadedFiles = {};

  // Handle single file uploads
  if (files.avatar) {
    uploadedFiles.avatar = files.avatar[0].path;
  }

  if (files.pharmacyLogo) {
    uploadedFiles.logo = files.pharmacyLogo[0].path;
  }

  // Handle multiple images
  if (files.pharmacyImage) {
    uploadedFiles.images = files.pharmacyImage.map((photo) => photo.path);
  }

  // Handle documents with names
  if (files.doctorDocument) {
    uploadedFiles.documents = files.doctorDocument.map((doc, index) => ({
      originalName: doc.originalname,
      documentName: documentNames[index] || doc.originalname,
      fileType: getFileTypeFromMimetype(doc.mimetype),
      size: doc.size,
      url: doc.path,
    }));
  }

  if (files.pharmacyDocument) {
    uploadedFiles.documents = files.pharmacyDocument.map((doc, index) => ({
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
  if (mimetype.startsWith("image/")) {
    return "image";
  } else if (mimetype === "application/pdf") {
    return "pdf";
  } else if (mimetype.includes("word")) {
    return "document";
  } else if (mimetype === "text/plain") {
    return "text";
  } else {
    return "other";
  }
};

// Helper function to extract document paths for cleanup
const extractDocumentPaths = (documents) => {
  const paths = [];

  if (!documents) return paths;

  // Handle array of documents
  if (Array.isArray(documents)) {
    documents.forEach((doc) => {
      if (doc.url) paths.push(doc.url);
    });
  }

  // Handle object with document properties
  if (typeof documents === "object") {
    Object.values(documents).forEach((doc) => {
      if (doc && typeof doc === "object" && doc.url) {
        paths.push(doc.url);
      }
    });
  }

  return paths;
};

// Helper function to validate document structure
const validateDocumentStructure = (documents) => {
  if (!documents) return true;

  // Handle array of documents
  if (Array.isArray(documents)) {
    return documents.every(
      (doc) =>
        doc &&
        typeof doc === "object" &&
        doc.originalName &&
        doc.documentName &&
        doc.url
    );
  }

  // Handle object with document properties
  if (typeof documents === "object") {
    return Object.values(documents).every(
      (doc) =>
        doc &&
        typeof doc === "object" &&
        doc.originalName &&
        doc.documentName &&
        doc.url
    );
  }

  return false;
};

module.exports = {
  handleFileUploads,
  getFileTypeFromMimetype,
  extractDocumentPaths,
  validateDocumentStructure,
};
