import mongoose, { model, Schema, Types } from "mongoose";

export const categoryTypes={
    income:'income',
    expense:'expense'
}

export const defaultCategories = [
    // Expense
    {
        categoryName: "Food",
        categoryType: categoryTypes.expense,
        isDefault: true
    },
    {
        categoryName: "Transport",
        categoryType: categoryTypes.expense,
        isDefault: true
    },
    {
        categoryName: "Shopping",
        categoryType: categoryTypes.expense,
        isDefault: true
    },
    {
        categoryName: "Bills",
        categoryType: categoryTypes.expense,
        isDefault: true
    },
    {
        categoryName: "Health",
        categoryType: categoryTypes.expense,
        isDefault: true
    },
    {
        categoryName: "Entertainment",
        categoryType: categoryTypes.expense,
        isDefault: true
    },

    // Income
    {
        categoryName: "Salary",
        categoryType: categoryTypes.income,
        isDefault: true
    },
    {
        categoryName: "Freelance",
        categoryType: categoryTypes.income,
        isDefault: true
    },
    {
        categoryName: "Investment",
        categoryType: categoryTypes.income,
        isDefault: true
    },
    {
        categoryName: "Gift",
        categoryType: categoryTypes.income,
        isDefault: true
    }
];

const categorySchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User'},
    categoryName:{type:String,trim:true,minlength:2,maxlength:50,required:true},
    categoryType:{type:String,enum:Object.values(categoryTypes),required:true},
    deletedAt:{type:Date,default:null},
    isDefault: {type: Boolean,default: false},
},{timestamps:true})

categorySchema.index({
    userId:1,
    categoryName:1
},{
    unique:true
})

export const categoryModel=mongoose.models.Category || model('Category',categorySchema)