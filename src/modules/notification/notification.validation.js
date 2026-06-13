import joi from "joi";
import { globalFields, paginationFields } from "../../globalFields.js";

export const getNotifications = joi.object({
    query: joi.object({
        page: paginationFields.page,
        size: paginationFields.size,
        isRead: joi.boolean()
    })
});
export const markAsRead = joi.object({
    params: joi.object({
        notificationId: globalFields.id.required()
    }).required()
});
export const deleteNotification = joi.object({
    params: joi.object({
        notificationId: globalFields.id.required()
    }).required()
});