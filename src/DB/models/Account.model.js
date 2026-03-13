import mongoose, { model, Schema, Types } from "mongoose";
import { currencyTypes } from "./User.model";

export const accountType={
    wallet:'wallet',
    checking:'checking',
    saving:'saving',
    credit:'credit',
    investment:'investment',
    loan:'loan',
}

const accountSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    accountName:{type:String,required:true,trim:true,minlength:4,maxlength:50},
    type:{type:String,enum:Object.values(accountType),required:true},
    balance:{type:Number,default:0},
    currency:{type:String,enum:Object.values(currencyTypes),default:currencyTypes.EGP},
    includeInTotal:{type:Boolean,default:true},
    isArchived:{type:Boolean,default:false},
    deletedAt:Date

},{timestamps:true})
accountSchema.index({userId:1})

export const accountModel=mongoose.models.Account || model('Account',accountSchema)