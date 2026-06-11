import mongoose, { model, Schema, Types } from "mongoose";
import { currencyTypes } from "./User.model.js";

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
    accountType:{type:String,enum:Object.values(accountType),required:true},
    balance:{type:Number,default:0},
    currency:{type:String,enum:Object.values(currencyTypes),default:currencyTypes.EGP},
    deletedAt:{type:Date,default:null},
    icon:String,
    color:String,

},{timestamps:true})
accountSchema.index({userId:1})

accountSchema.index(
    {
        userId: 1,
        accountName: 1
    },
    {
        unique: true
    }
);

export const accountModel=mongoose.models.Account || model('Account',accountSchema)