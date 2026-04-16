import joi from "joi"
import { globalFields } from "../../globalFields.js"



export const signupSchema = joi.object({
    body: joi.object().keys({
        userName: globalFields.userName.required(),
        email:globalFields.email.required(),
        password: globalFields.password.required(),
        phone: globalFields.phone.required(),
        language: globalFields.language,
        currency: globalFields.currency,
    }).required()
}).required()

export const confirmEmailSchema = joi.object({
    body: joi.object().keys({
        code:globalFields.code.required(),
        email:globalFields.email.required(),
    }).required()
}).required()

export const loginSchema = joi.object({
    body: joi.object().keys({
        password: globalFields.password.required(),
        email:globalFields.email.required(),
    }).required()
}).required()

export const forgetPasswordSchema = joi.object({
    body: joi.object().keys({
        email:globalFields.email.required(),
    }).required()
}).required()

export const resetPasswordSchema = joi.object({
    body: joi.object().keys({
        email: globalFields.email.required(),
        password: globalFields.password.required(),
        confirmPassword:globalFields.confirmPassword.required(),
        code: globalFields.code.required(),
    }).required()
}).required()