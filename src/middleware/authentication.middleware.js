import { userModel } from "../DB/models/User.model.js";
import { verifyToken } from "../utilis/security/token.js";

export const authentication=()=>{
    return async (req,res,next)=>{
        const [bearer,token]=req.headers.authorization?.split(' ');
        if (!bearer || !token) {
            return next(new Error('bearer or token required',{cause:400}))
        }
        let signature;
        switch (bearer) {
            case 'bearer':
                signature=process.env.ACCESS_SIGNATURE;
                break;
            case 'system':
                signature=process.env.ADMIN_ACCESS_SIGNATURE;
                break;
        
            default:
                break;
        }
        const decoded=verifyToken({token,signature});
        if (Date.now() > decoded.exp*1000) {
            return next(new Error('token is expired',{cause:400}))
        }
        const user = await userModel.findOne({_id:decoded.id,isActive:true});
        if (!user) {
            return next(new Error('token not authorized',{cause:401}))
        }
        req.user=user;
        next();
    }
}