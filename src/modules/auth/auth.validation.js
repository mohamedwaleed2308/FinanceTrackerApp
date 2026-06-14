import joi from "joi"
import { globalFields } from "../../globalFields.js"



export const signupSchema = joi.object({
    body: joi.object({
        userName: globalFields.userName.required(),
        email:globalFields.email.required(),
        password: globalFields.password.required(),
        phone: globalFields.phone.required(),
        language: globalFields.language,
        currency: globalFields.currency,
    }).required()
}).required()

export const confirmEmailSchema = joi.object({
    body: joi.object({
        code:globalFields.code.required(),
        email:globalFields.email.required(),
    }).required()
}).required()

export const loginSchema = joi.object({
    body: joi.object({
        password: globalFields.password.required(),
        email:globalFields.email.required(),
    }).required()
}).required()

export const forgetPasswordSchema = joi.object({
    body: joi.object({
        email:globalFields.email.required(),
    }).required()
}).required()

export const resetPasswordSchema = joi.object({
    body: joi.object({
        email: globalFields.email.required(),
        password: globalFields.password.required(),
        confirmPassword:globalFields.confirmPassword.required(),
        code: globalFields.code.required(),
    }).required()
}).required()

export const reActiveProfile = joi.object({
    body: joi.object({
        email: globalFields.email.required(),
        reActiveCode: globalFields.code.required(),
    }).required()
}).required()
export const googleLoginSchema = joi.object({
    body: joi.object({
        idToken: joi.string().required()
    }).required()
})