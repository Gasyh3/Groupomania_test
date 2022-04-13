const multer = require("multer");

const MIME_TYPES = {
  // notre dictionnaire d'extensions
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image.gif": "gif",
  "image.webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // destination des images
    callback(null, "./upload");
  },
  filename: (req, file, callback) => {
    // nouveau nom du fichier image pour éviter les doublons
    const name = file.originalname.replace(/\.[^/.]+$/, "");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
module.exports = multer({ storage: storage }).single("image"); // stockage de l'image publiée
