const fs = require("fs").promises;
const path = require("path");
const { cloudinary } = require("./cloudinary");
const { isLocalImageUrl, isCloudinaryUrl } = require("./imageUtils");

/**
 * Delete a single image from storage
 * @param {string} imagePath - The image path or URL to delete
 * @returns {Promise<void>}
 */
const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    if (isLocalImageUrl(imagePath)) {
      const filePath = path.join(
        process.cwd(),
        "src",
        imagePath.replace(/^\//, "")
      );
      await fs.unlink(filePath);
    } else if (isCloudinaryUrl(imagePath)) {
      // Extract public_id from Cloudinary URL
      // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const urlParts = imagePath.split("/");
      const uploadIndex = urlParts.findIndex((part) => part === "upload");

      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Get everything after 'upload' and before the file extension
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = pathAfterUpload.split(".")[0]; // Remove file extension

        if (publicId) {
          // Check if cloudinary is properly configured
          if (!cloudinary || !cloudinary.uploader) {
            return;
          }

          await cloudinary.uploader.destroy(publicId);
        }
      }
    }
  } catch (error) {
    // Don't throw the error, just silently handle it
  }
};

/**
 * Delete multiple images from storage
 * @param {string[]} imagePaths - Array of image paths or URLs to delete
 * @returns {Promise<void>}
 */
const deleteImages = async (imagePaths) => {
  if (!Array.isArray(imagePaths)) {
    return;
  }

  if (imagePaths.length === 0) {
    return;
  }

  const deletePromises = imagePaths.map((path) => deleteImage(path));

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    // Don't throw the error, just silently handle it
  }
};

/**
 * Extract image paths from model instance
 * @param {Object} instance - Model instance
 * @returns {string[]} Array of image paths
 */
const extractImagePaths = (instance) => {
  const paths = [];

  // Handle single image fields
  if (instance.avatar) paths.push(instance.avatar);
  if (instance.logo) paths.push(instance.logo);
  if (instance.agencyImages) paths.push(instance.agencyImages);
  if (instance.stationImages) paths.push(instance.stationImages);
  if (instance.document) paths.push(instance.document);
  if (instance.imageUrl) paths.push(instance.imageUrl);

  // Handle array of images
  if (Array.isArray(instance.images)) {
    paths.push(...instance.images);
  }

  return paths;
};

/**
 * Clean up images before model deletion
 * @param {Object} instance - Model instance being deleted
 * @returns {Promise<void>}
 */
const cleanUpInstanceImages = async (instance) => {
  const imagePaths = extractImagePaths(instance);
  await deleteImages(imagePaths);
};

const cleanUpFileImages = async (req) => {
  if (!req.file && !req.files) return;

  const imagePaths = [];

  // Case 1: Single file upload (req.file)
  if (req.file) {
    imagePaths.push(req.file.path);
  }

  // Case 2: Multiple file uploads (req.files)
  if (req.files) {
    // upload.array() gives an array
    if (Array.isArray(req.files)) {
      imagePaths.push(...req.files.map((file) => file.path));
    }
    // upload.fields() gives an object of arrays
    else if (typeof req.files === "object" && req.files !== null) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          imagePaths.push(...fileArray.map((file) => file.path));
        }
      });
    }
  }

  // Delete all collected image paths that are valid strings
  const validImagePaths = imagePaths.filter((p) => typeof p === "string" && p);
  if (validImagePaths.length > 0) {
    await deleteImages(validImagePaths);
  }
};

/**
 * Clean up old images when updating
 * @param {Object} instance - Model instance being updated
 * @param {Object} previousValues - Previous values of the instance
 * @returns {Promise<void>}
 */
const cleanupOldImages = async (instance, previousValues) => {
  const oldPaths = extractImagePaths(previousValues);
  const newPaths = extractImagePaths(instance);

  // Find images that were removed
  const removedPaths = oldPaths.filter((path) => !newPaths.includes(path));
  await deleteImages(removedPaths);
};

module.exports = {
  deleteImage,
  deleteImages,
  cleanUpFileImages,
  cleanUpInstanceImages,
  cleanupOldImages,
};
