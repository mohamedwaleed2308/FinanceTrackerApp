import mongoose, { model, Schema, Types } from "mongoose";

export const transactionTypes = {
    income: 'income',
    expense: 'expense',
    transfer: 'transfer',
}
export const statusTypes = {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed',
}

const transactionSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    accountId: { type: Types.ObjectId, ref: 'Account', required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category' },
    toAccountId: { type: Types.ObjectId, ref: 'Account' },
    amount: { type: Number, required: true, default: 0 },
    transactionType: { type: String, enum: Object.values(transactionTypes), required: true },
    title: {type: String,required: true,trim: true},
    shopName: {type: String,trim: true},
    note: { type: String },
    date: { type: Date, required: true },
    status: { type: String, enum: Object.values(statusTypes), default: statusTypes.pending },
    deletedAt: { type: Date, default: null }

}, { timestamps: true })
transactionSchema.index({
    userId: 1,
    date: -1
})
transactionSchema.index({ accountId: 1 })

export const transactionModel = mongoose.models.Transaction || model('Transaction', transactionSchema)