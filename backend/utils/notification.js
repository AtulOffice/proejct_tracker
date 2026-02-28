import Notification from "../models/notification.model.js";
import { getIO } from "../socket/socket.js";

export const sendNotification = async ({
    type,
    title,
    message,
    targetRole,
    recipientId,
    createdBy
}) => {

    let notification = await Notification.create({
        type,
        title,
        message,
        targetRole,
        recipients: recipientId ? [recipientId] : [],
        createdBy
    });

    notification = await notification.populate(
        "createdBy",
        "username email"
    );

    const io = getIO();
    if (recipientId) {
        io.to(`user_${recipientId}`).emit("notification", notification);
    }
    if (targetRole) {
        io.to(`role_${targetRole}`).emit("notification", notification);
    }
};
