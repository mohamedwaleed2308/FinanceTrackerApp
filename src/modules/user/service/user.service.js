import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";


export const profile=asyncHandler(
    async(req,res , next)=>{
        return successResponse({res,message:'done',status:200,data:{user:req.user}})
    }
)
export const updateProfile=asyncHandler(
    async(req,res , next)=>{
        
        return successResponse({res,message:'done',status:200,data:{user:req.user}})
    }
)