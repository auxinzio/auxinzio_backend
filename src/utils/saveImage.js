const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.saveWebpImage = async (file, folder) => {
  if (!file) return null;

  const uploadPath = path.join("uploads", folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // original filename without extension
  const originalName = path
    .basename(file.originalname, path.extname(file.originalname))
    .replace(/\s+/g, "-")
    .toLowerCase();

  const fileName = `${originalName}.webp`;
  const fullPath = path.join(uploadPath, fileName);

  await sharp(file.buffer).webp({ quality: 80 }).toFile(fullPath);

  return fileName;
};
