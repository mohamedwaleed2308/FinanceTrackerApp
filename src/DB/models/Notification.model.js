import mongoose, { model, Schema, Types } from "mongoose";

const notificationSchema = new Schema({

    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

notificationSchema.index({
    userId: 1,
    isRead: 1
});

export const notificationModel =mongoose.models.Notification || model('Notification', notificationSchema);