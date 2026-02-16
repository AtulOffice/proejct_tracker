import notificationModel from "../models/notification.model.js";


export const getGlobalNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notificationModel.find({
        }).sort({ createdAt: -1 });

        const formattedNotifications = notifications.map((n) => {
            const isRead = n.readBy.some(
                (r) => r.userId.toString() === userId.toString()
            );

            return {
                ...n._doc,
                isRead,
            };
        });
        res.status(200).json({ success: true, message: "notification fetched successfully", Notifications: formattedNotifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
