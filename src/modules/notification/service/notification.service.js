import { notificationModel } from "../../../DB/models/Notification.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";

export const getNotifications = asyncHandler(
    async (req, res, next) => {

        const { page = 1, size = 10, isRead } = req.validatedData.query;

        const filter = {
            userId: req.user._id
        };

        if (typeof isRead === 'boolean') {
            filter.isRead = isRead;
        }

        const skip = (page - 1) * size;

        const notifications = await notificationModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size);

        const totalCount = await notificationModel.countDocuments(filter);

        return successResponse({
            res, message: 'Notifications retrieved successfully',
            data: {
                notifications,
                pagination: { page, size, totalCount }
            }
        });
    }
);
export const markAsRead = asyncHandler(
    async (req, res, next) => {

        const { notificationId } = req.validatedData.params;

        const notification = await notificationModel.findOneAndUpdate({
            _id: notificationId,
            userId: req.user._id
        }, { isRead: true }, { new: true });

        if (!notification) {
            return next(new Error('Notification not found', { cause: 404 }));
        }

        return successResponse({ res, status: 200, message: 'Notification marked as read', data: { notification } });
    }
);

export const deleteNotification = asyncHandler(
    async (req, res, next) => {

        const { notificationId } = req.validatedData.params;

        const notification = await notificationModel.findOneAndDelete({
            _id: notificationId,
            userId: req.user._id
        });

        if (!notification) {
            return next(new Error('Notification not found', { cause: 404 }));
        }

        return successResponse({ res, status: 200, message: 'Notification deleted successfully' });
    }
);