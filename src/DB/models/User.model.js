import mongoose, { model, Schema, Types } from "mongoose";

export const currencyTypes={
    USD:'USD',
    EGP:'EGP'
}
export const roleTypes={
    user:'user',
    admin:'admin'
}
export const authType={
    local:'local',
    google:'google'
}
export const languageType={
    arabic:'arabic',
    english:'english'
}
export const themeType={
    light:'light',
    dark:'dark'
}

const userSchema= new Schema({
    userName:{type:String,required:true,minlength:4,maxlength:40,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true},
    isConfirmed:{type:Boolean,default:false},
    password:{type:String,required:true},
    phone:{type:String},
    googleId:{type:String},
    userImage: { secure_url: String, public_id: String },
    authProvider:{type:String,enum:Object.values(authType),default:authType.local},
    currency:{type:String,enum:Object.values(currencyTypes),default:currencyTypes.EGP},
    role:{type:String,enum:Object.values(roleTypes),default:roleTypes.user},
    isActive:{type:Boolean,default:true},
    settings:{
        language:{type:String,enum:Object.values(languageType),default:languageType.english},
        theme:{type:String,enum:Object.values(themeType),default:themeType.light},
        notifications:{
            email:{type:Boolean,default:true},
            push:{type:Boolean,default:true}
        }
    },
    accounts:[{type:Types.ObjectId,ref:'Account'}],
    deletedAt:Date
},{timestamps:true})

// userSchema.index({email:1})

export const userModel= mongoose.models.User || model('User',userSchema)
