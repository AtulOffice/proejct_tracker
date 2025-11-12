import FormData from "form-data";
import axios from "axios";
import mime from "mime-types";

export const uploadImageToGlobalServer = async (
  buffer,
  originalName,
  subfolder = "group-profile"
) => {
  try {
    const form = new FormData();
    const contentType = mime.lookup(originalName) || "application/octet-stream";
    form.append("image", buffer, {
      filename: originalName,
      contentType: contentType,
    });
    form.append("subfolder", subfolder);

    const response = await axios.post(`${process.env.IMG_URL}/upload`, form, {
      headers: form.getHeaders(),
    });

    return response.data; // Expected: image URL
  } catch (err) {
    console.error("Image upload failed:", err.message);
    throw new Error("Image Upload fail..");
  }
};
export const deleteImageToGlobalServer = async (imageUrl) => {
  try {
    const response = await axios.delete(process.env.IMG_URL + "/deleteImage", {
      params: { url: imageUrl },
    });
    // console.log('Image deleted successfully:', response.data);
    return response.data; // { message: 'Image deleted successfully.' }
  } catch (error) {
    console.error("Failed to delete image:", error.message);
    return 1;
  }
};
