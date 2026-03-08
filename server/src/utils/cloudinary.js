import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

/**
 * Extract Cloudinary public_id from a secure_url
 * URL format: https://res.cloudinary.com/{cloud}/image/upload/v{ver}/{public_id}.{ext}
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathWithExt = parts[1];
    // remove version prefix like v1234567890/
    const withoutVersion = pathWithExt.replace(/^v\d+\//, '');
    // remove file extension
    const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
};

/**
 * Delete a single image from Cloudinary by its URL
 */
export const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`☁️  Cloudinary deleted: ${publicId} →`, result.result);
    return result;
  } catch (error) {
    console.error(
      `☁️  Cloudinary delete failed for ${publicId}:`,
      error.message,
    );
    return null;
  }
};

/**
 * Delete multiple images from Cloudinary by their URLs
 */
export const deleteManyFromCloudinary = async (urls) => {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length === 0) return;
  const results = await Promise.allSettled(
    validUrls.map((url) => deleteFromCloudinary(url)),
  );
  return results;
};

export default cloudinary;
