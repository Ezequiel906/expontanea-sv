import { Request, Response, NextFunction } from "express";
import multer from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(
        new Error(
          "Formato de imagen inválido. Usa JPG, PNG, WebP o GIF."
        )
      );
      return;
    }

    callback(null, true);
  },
});

export const uploadProductImageFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      res.status(400).json({
        success: false,
        message: "La imagen no debe superar 5 MB.",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "La imagen seleccionada no es válida.",
    });
  });
};
