import { cloudinary } from "../config/cloudinary";

export const uploadProductImage = async (
  file: Express.Multer.File
) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary no está configurado correctamente");
  }

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "expontanea-sv/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary no devolvió una URL segura"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};

const getCloudinaryPublicId = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);

    if (!url.hostname.includes("res.cloudinary.com")) {
      return null;
    }

    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return null;
    }

    const uploadPath = url.pathname.slice(uploadIndex + "/upload/".length);
    const parts = uploadPath.split("/").filter(Boolean);
    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts =
      versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts;

    if (!publicIdParts.length) {
      return null;
    }

    return publicIdParts.join("/").replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
};

export const deleteProductImage = async (imageUrl: string) => {
  const publicId = getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
