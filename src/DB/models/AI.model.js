import mongoose, { model, Schema, Types } from "mongoose";


const aiInsightSchema = new Schema({
    userId:{type:Types.ObjectId,ref:'User'},
    summary:{type:String,required:true},
    suggestions:{type:String,required:true},
},{timestamps:true})

export const AIModel=mongoose.models.AI || model('AI',aiInsightSchema)