import { uploadImageToGlobalServer } from "../utils/imageUtils.js";

export const uploadImagecontroller = async (req, res) => {
  try {
    if (!req.files || !req.files.resumeFile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const resumeFile = req.files.resumeFile; 
    const uploadedData = await uploadImageToGlobalServer(
      resumeFile.data,  
      resumeFile.name,  
      "resume"        
    );

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      data: uploadedData, 
    });
  } catch (error) {
    console.error("❌ Error in uploadImagecontroller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image.",
      error: error.message,
    });
  }
};
