import mongoose, { model, Schema, Types } from "mongoose";

export const transactionTypes={
    income:'income',
    expense:'expense',
    transfer:'transfer',
}
export const statusType={
    pending:'pending',
    completed:'completed',
    failed:'failed',
}

const transactionSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    accountId:{type:Types.ObjectId,ref:'Account',required:true},
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    amount:{type:Number,required:true,default:0},
    transactionType:{type:String,enum:Object.values(transactionTypes),required:true},
    note:{type:String},
    date:{type:Date,required:true},
    status:{type:String,enum:Object.values(statusType),default:statusType.pending},
    deletedAt:Date

},{timestamps:true})
transactionSchema.index({userId:1})
transactionSchema.index({accountId:1})

export const transactionModel= mongoose.models.Transaction || model('Transaction',transactionSchema)