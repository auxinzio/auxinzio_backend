const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only images allowed"));
};

// Resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resume");
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9.-]/g, "");
    cb(null, cleanName);
  },
});

const resumeFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error("Only PDF/DOC allowed"));
};

exports.uploadTeamImage = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadProductImage = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadServiceImage = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadSolutionImage = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadFeedbackImage = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
