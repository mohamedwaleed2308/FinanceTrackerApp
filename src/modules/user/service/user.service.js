import { userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";


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