import mongoose, { model, Schema, Types } from "mongoose";

export const intervalType={
    weekly:'weekly',
    monthly:'monthly',
    yearly:'yearly',
}


const budgetSchema= new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    amount:{type:Number,required:true,min:0},
    spent:{type:Number,default:0,min:0},
    interval:{type:String,enum:Object.values(intervalType),required:true},
    startDate:{type:Date,required:true,default:Date.now},
    endDate:{type:Date},
    alertThreshold:{type:Number,default:80},
    isActive:{type:Boolean,default:true},
    deletedAt:Date

},{timestamps:true})

budgetSchema.index({userId:1,categoryId:1,interval:1},{unique:true})

export const budgetModel=mongoose.models.Budget || model('Budget',budgetSchema)