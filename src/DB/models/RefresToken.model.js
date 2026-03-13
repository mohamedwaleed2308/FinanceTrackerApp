import mongoose, { model, Schema, Types } from "mongoose";


const refreshTokenSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    token:{type:String,unique:true,required:true},
    isRevoked:{type:Boolean,default:false},
    expiresAt:{type:Date,required:true}
},{timestamps:true})

refreshTokenSchema.index({userId:1})

export const RefreshTokenModel=mongoose.models.RefreshToken || model('RefreshToken',refreshTokenSchema)