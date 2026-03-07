const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/**
 * Middleware to convert uploaded images to WebP format.
 * Expects files in req.file or req.files (from multer memoryStorage).
 * @param {string} folder - The folder under 'uploads/' where the image should be saved.
 */
const convertToWebp = (folder) => {
  return async (req, res, next) => {
    try {
      if (!req.file && (!req.files || Object.keys(req.files).length === 0)) {
        return next();
      }

      const uploadPath = path.join("uploads", folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const processFile = async (file) => {
        const originalName = path.parse(file.originalname).name;
        const cleanName = originalName
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, ""); // Keep only alphanumeric and underscores

        const fileName = `${cleanName}.webp`;
        const fullPath = path.join(uploadPath, fileName);

        await sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(fullPath);

        // Update the file object to reflect the new filename and path
        // This makes it compatible with existing controller logic
        file.filename = fileName;
        file.path = path.join("uploads", folder, fileName);
      };

      if (req.file) {
        await processFile(req.file);
      }

      if (req.files) {
        for (const fieldname in req.files) {
          const files = req.files[fieldname];
          if (Array.isArray(files)) {
            for (const file of files) {
              await processFile(file);
            }
          }
        }
      }

      next();
    } catch (error) {
      console.error("WebP Conversion Error:", error);
      next(error);
    }
  };
};

module.exports = convertToWebp;
