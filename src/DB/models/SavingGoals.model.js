import mongoose, { model, Schema, Types } from "mongoose";

export const priorityType={
    high:'high',
    medium:'medium',
    low:'low',
    optional:'optional',
}

const savingGoalSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    goalName:{type:String,required:true,minlength:4,maxlength:100},
    targetAmount:{type:Number,required:true,min:0},
    currentAmount:{type:Number,default:0,min:0,validate:{
        validator:function(value){
            return value <= this.targetAmount
        },
        message:"current amount cannot exceed target amount"
    }},
    targetDate:{type:Date},
    isCompleted:{type:Boolean,default:false},
    priority:{type:String,enum:Object.values(priorityType),default:priorityType.optional},
    deletedAt:Date

},{timestamps:true})

savingGoalSchema.index({userId:1})

export const savingGoalModel=mongoose.models.SavingGoal || model('SavingGoal',savingGoalSchema)