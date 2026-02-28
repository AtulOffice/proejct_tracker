import notificationModel from "../models/notification.model.js";
import { getIO } from "../socket/socket.js";


// export const getGlobalNotifications = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const role = req.user.role;
//         const notifications = await notificationModel
//             .find({
//                 $or: [
//                     { recipients: userId },
//                     { targetRole: role }
//                 ]
//             })
//             .sort({ createdAt: -1 });

//         const formattedNotifications = notifications.map((n) => {
//             const isRead = n.readBy.some(
//                 (r) => r.userId.toString() === userId.toString()
//             );

//             return {
//                 ...n.toObject(),
//                 isRead
//             };
//         });

//         res.status(200).json({
//             success: true,
//             message: "notification fetched successfully",
//             Notifications: formattedNotifications
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };


export const getGlobalNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        const notifications = await notificationModel
            .find({
                $or: [
                    { recipients: userId },
                    { targetRole: role }
                ],
                "readBy.userId": { $ne: userId }
            }).populate("createdBy", "_id username email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "notification fetched successfully",
            Notifications: notifications
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const markAsRead = async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;
    try {
        const notification = await notificationModel.findOneAndUpdate(
            {
                _id: id,
                "readBy.userId": { $ne: userId }
            },
            {
                $push: {
                    readBy: {
                        userId,
                        readAt: new Date()
                    }
                }
            },
            { new: true }
        );
        const io = getIO();
        io.to(`user_${userId}`).emit("notification_read", id);
        res.status(200).json({
            success: true,
            message: "notification update successfully",
            notification: notification
        });
    } catch (e) {
        console.log(e)
        return res.status(404).json({ success: false, message: e.data?.message || "something went wrong" })
    }
}

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        await notificationModel.updateMany(
            {
                $or: [
                    { recipients: userId },
                    { targetRole: role }
                ],
                "readBy.userId": { $ne: userId }
            },
            {
                $push: {
                    readBy: {
                        userId,
                        readAt: new Date()
                    }
                }
            });
        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};