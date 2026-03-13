import { Schema, Types } from "mongoose";

export const otpTypes={
    emailConfirmation:'emailConfirmation',
    resetPassword:'resetPassword',
    
}

const otpSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    otp:{type:String,required:true},
    otpTime:{type:Date,default:Date.now,required:true},
    expiresAt:Date,
    otpType:{type:String,enum:Object.values(otpTypes),required:true}
},{timestamps:true})