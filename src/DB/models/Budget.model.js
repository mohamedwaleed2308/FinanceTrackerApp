import mongoose, { model, Schema, Types } from "mongoose";

export const intervalType = {
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly',
}


const budgetSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    amount: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    interval: { type: String, enum: Object.values(intervalType), required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: {
        type: Date, validation: {
            validator: function (value) {
                return !value || value > this.startDate
            },
            message: 'End date must be after strat date'
        }
    },
    alertThreshold: { type: Number, default: 80, min: 1, max: 100 },
    isActive: { type: Boolean, default: true },
    deletedAt: {type:Date,default:null},
    alertSent: {type: Boolean,default: false}

}, { timestamps: true })

budgetSchema.index({ userId: 1, categoryId: 1, interval: 1 }, { unique: true })

export const budgetModel = mongoose.models.Budget || model('Budget', budgetSchema)