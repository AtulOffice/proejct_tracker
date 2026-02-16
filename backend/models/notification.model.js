import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: String,
    title: String,
    message: String,
    targetRole: String,
    recipients: [mongoose.Schema.Types.ObjectId],
    readBy: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            readAt: Date
        }
    ]
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
