import { customAlphabet } from "nanoid";
import { userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { hashing } from "../../../utilis/security/hash.js";
import { otpModel } from "../../../DB/models/OtpSetting.model.js";
import { sendEmail } from "../../../utilis/email/sendEmail.js";


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
            otpType: 'emailConfirmation'
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