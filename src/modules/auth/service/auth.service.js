import { customAlphabet } from "nanoid";
import { userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { comparing, hashing } from "../../../utilis/security/hash.js";
import { otpModel, otpTypes } from "../../../DB/models/OtpSetting.model.js";
import { sendEmail } from "../../../utilis/email/sendEmail.js";
import { generateToken, verifyToken } from "../../../utilis/security/token.js";
import { RefreshTokenModel } from "../../../DB/models/RefresToken.model.js";


export const signup = asyncHandler(
    async (req, res, next) => {
        let { userName, email, password, phone, language, currency } = req.validatedData.body;
        email = email.toLowerCase()
        password = hashing({ plainText: password })
        let user;
        try {
            user = await userModel.create({
                userName, email, password, phone,
                currency, settings: {
                    language: language || 'english'
                }
            });
        } catch (error) {
            // when 2 user create by same email in the same time so this make error
            // 11000 => MongoDB duplicate key error (unique constraint violation)
            if (error.code === 11000) {
                return next(new Error('Email already exists', { cause: 409 }));
            }
            return next(error)
        }
        const otp = customAlphabet('0123456789', 5)()
        await otpModel.create({
            userId: user._id,
            otp: hashing({ plainText: otp }),
            expiresAt: new Date(Date.now() + (2 * 60 * 60 * 1000)),
            otpType: otpTypes.emailConfirmation
        })
        try {
            await sendEmail({
                to: [email],
                text: 'please confirm your email',
                subject: 'cofirmation email',
                code: otp
            })
        } catch (error) {
            return next(new Error('Failed to send email', { cause: 500 }));
        }



        return successResponse({ res, status: 201, message: 'signup done please confirm your email', data: { userId: user._id } })
    }
)

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, code } = req.validatedData.body
        const user = await userModel.findOne({ email, isConfirmed: false })
        if (!user) {
            return next(new Error('user not found or already confirmed', { cause: 404 }))
        }
        const userOtp = await otpModel.findOne({ userId: user._id })
        if (!userOtp) {
            return next(new Error('otp not found', { cause: 404 }))
        }
        if (Date.now() > Date.parse(userOtp.expiresAt)) {
            await otpModel.deleteOne({ _id: userOtp._id });
            const code = customAlphabet('0123456789', 5)()
            await sendEmail({ to: email, subject: 'confirm Email', text: "please confirm your email", code })
            return next(new Error('your otp is expired, we are send new code to your email', { cause: 400 }))
        }
        if (!comparing({ plainText: code, hashValue: userOtp.otp })) {
            return next(new Error('code or email is not correct', { cause: 400 }))
        }

        await otpModel.deleteOne({ _id: userOtp._id });
        await userModel.updateOne({ _id: user._id }, { isConfirmed: true })
        return successResponse({ res, message: 'confirm email done', status: 200 })
    }
)

export const login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.validatedData.body;
        const user = await userModel.findOne({ email, isConfirmed: true })
        if (!user) {
            return next(new Error('email or password not correct', { cause: 404 }))
        }
        if (!comparing({ plainText: password, hashValue: user.password })) {
            return next(new Error('email or password not correct', { cause: 400 }))
        }
        const accessToken = generateToken({ payload: { id: user._id }, signature: process.env.ACCESS_SIGNATURE, expiresIn: process.env.ACCESS_EXPIRESIN })
        const refreshToken = generateToken({ payload: { id: user._id }, signature: process.env.REFRESH_SIGNATURE, expiresIn: process.env.REFRESH_EXPIRESIN })

        await RefreshTokenModel.create({
            userId: user._id,
            token: refreshToken, // Remember token is stored hashed not normal
            expiresAt: new Date(Date.now() + (parseInt(process.env.REFRESH_EXPIRESIN)*1000)),
        })


        return successResponse({ res, message: 'login done', status: 200, data: { accessToken, refreshToken } })
    }
)
export const forgetPassword=asyncHandler(
    async(req,res,next)=>{
        const {email}=req.validatedData.body;
        const user=await userModel.findOne({email,isConfirmed:true});
        if (!user) {
            return next(new Error('user not exist or not confirmed',{cause:404}))
        }
        const code= customAlphabet('0123456789',5)()
        await sendEmail({to:email,subject:'forget password',text:'Use this code to reset password',code})
        await otpModel.create({
            userId:user._id,
            otp:hashing({plainText:code}),
            expiresAt:new Date(Date.now()+ (2*60*60*1000)),
            otpType:otpTypes.resetPassword
        })
        return successResponse({res,message:'forget password code is send',status:200})

    }
)
export const resetPassword=asyncHandler(
    async(req,res,next)=>{
        const {email,code,password}=req.validatedData.body;
        const user=await userModel.findOne({email,isConfirmed:true});
        if (!user) {
            return next(new Error('user not exist or not confirmed',{cause:404}))
        }
        const findCode=await otpModel.findOne({userId:user._id,otpType:otpTypes.resetPassword});
        if(Date.now()>Date.parse(findCode.expiresAt)){
            return next(new Error('your otp is expired, please return to forget password',{cause:400}))
        }
        if (!comparing({plainText:code,hashValue:findCode.otp})) {
            return next(new Error('code is not correct',{cause:404}))
        }
        if (comparing({plainText:password,hashValue:user.password})) {
            return next(new Error('new password is match with old password'))
        }
        await userModel.findByIdAndUpdate(user._id,{password:hashing({plainText:password})})
        return successResponse({res,message:'password is updated',status:200})

    }
)

export const refreshToken = asyncHandler(
    async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return next(new Error('token is required', { cause: 400 }))
        }
        const { id, exp } = verifyToken({ token, signature: process.env.REFRESH_SIGNATURE })
        const userToken = await RefreshTokenModel.findOne({ userId: id,token })
        if (!userToken) {
            return next(new Error('token is not valid', { cause: 401 }))
        }
        if (userToken.token ==! token) {
            return next(new Error('token is not valid',{cause:400}))
        }
        // console.log(Date.parse(userToken.expiresAt)/1000,exp) 
        if (Date.now() > Date.parse(userToken.expiresAt)) {
            return next(new Error('token is expired', { cause: 400 }))
        }
        const accessToken = generateToken({
            payload: { id },
            signature: process.env.ACCESS_SIGNATURE,
            expiresIn: process.env.ACCESS_EXPIRESIN
        })
        return successResponse({ res, message: 'done', status: 200, data: { accessToken } })
    }
)