import { RefreshTokenModel } from "../../../DB/models/RefresToken.model.js";
import { userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { comparing, hashing } from "../../../utilis/security/hash.js";


export const profile = asyncHandler(
    async (req, res, next) => {
        return successResponse({ res, message: 'done', status: 200, data: { user: req.user } })
    }
)
export const updateProfile = asyncHandler(
    async (req, res, next) => {
        const { userName, phone, language, theme, currency } = req.validatedData.body;
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id, {
            $set: {
                userName,
                phone,
                "settings.language": language,
                "settings.theme": theme,
                currency
            },
            
        }, { new: true })
        return successResponse({ res, message: 'done', status: 200 })
    }
)
export const profileSettings = asyncHandler(
    async (req, res, next) => {
        const { language, theme } = req.validatedData.body;
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id, {
            $set: {
                "settings.language": language,
                "settings.theme": theme,
            },
            
        }, { new: true })
        return successResponse({ res, message: 'done', status: 200 })
    }
)

export const changePassword= asyncHandler(
    async(req,res,next)=>{
        const {oldPassword,newPassword,confirmNewPassword}=req.validatedData.body;
        if (newPassword != confirmNewPassword) {
            return next(new Error('confirm new password does not match'))
        }
        if (!comparing({plainText:oldPassword,hashValue:req.user.password})) {
            return next(new Error('old password is not correct',{cause:400}))
        }
        
        if (comparing({plainText:newPassword,hashValue:req.user.password})) {
            return next(new Error('new password is the same old password'))
        }
        await userModel.findByIdAndUpdate(req.user._id,{
            $set:{
                password:hashing({plainText:newPassword})
            }
        })
        return successResponse({res,message:'done',status:200})
        
    }
)

export const deleteProfile=asyncHandler(
    async(req,res,next)=>{
        if (!req.user.isActive) {
            return next(new Error('profile is already not active',{cause:400}))
        }
        await userModel.findByIdAndUpdate(req.user._id,{
            $set:{isActive:false}
        })
        await RefreshTokenModel.deleteMany({userId:req.user._id})
        return successResponse({res,message:'done',status:200})
    }
)