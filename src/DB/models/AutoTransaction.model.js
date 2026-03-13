import mongoose, { model, Schema } from "mongoose";
import { transactionTypes } from "./Transaction.model";
import { currencyTypes } from "./User.model";

export const frequencyType={
    daily:'daily',
    weekly:'weekly',
    monthly:'monthly',
    yearly:'yearly',
}

const autoTransactionSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    accountId: { type: Types.ObjectId, ref: 'Account', required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    transactionType:{type:String,enum:Object.values(transactionTypes),required:true},
    amount:{type:Number,required:true,min:0},
    note:{type:String,maxlength:100},
    frequency:{type:String,enum:Object.values(frequencyType),required:true},
    interval:{type:Number,required:true,min:1},
    startDate:{type:Date,required:true,default:Date.now},
    endDate:{type:Date},
    isActive:{type:Boolean,default:true},
    nextExecutionDate:{type:Date,required:true},
    lastExecutionDate:{type:Date,default:null},
    currency:{type:String,enum:Object.values(currencyTypes)}
}, { timestamps: true })

autoTransactionSchema.index({
  nextExecutionDate:1,
  isActive:1,
  userId:1, 
  accountId:1, 
  categoryId:1, 
  frequency:1 
},{ unique:false })

export const autoTransactionModel = mongoose.models.AutoTransaction || model('AutoTransaction', autoTransactionSchema)