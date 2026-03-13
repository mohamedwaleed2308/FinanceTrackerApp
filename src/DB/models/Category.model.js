import mongoose, { model, Schema, Types } from "mongoose";

export const categoryTypes={
    income:'income',
    expense:'expense'
}

const categorySchema=new Schema({
    user_id:{type:Types.ObjectId,ref:'User'},
    categoryName:{type:String,required:true},
    categoryType:{type:String,enum:Object.values(categoryTypes)},
    deletedAt:Date
},{timestamps:true})

export const categoryModel=mongoose.models.Category || model('Category',categorySchema)