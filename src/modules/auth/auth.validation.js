import joi from "joi"
import { currencyTypes, languageType } from "../../DB/models/User.model.js"



export const signupSchema = joi.object({
    body: joi.object().keys({
        userName: joi.string().min(4).max(30).required(),
        email: joi.string().email({
            tlds: { allow: false },
            minDomainSegments: 2,
            maxDomainSegments: 3
        }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required(),
        language: joi.string().valid(...Object.values(languageType)),
        currency: joi.string().valid(...Object.values(currencyTypes)),
    }).required()
}).required()
export const confirmEmailSchema = joi.object({
    body: joi.object().keys({
        code: joi.string().pattern(new RegExp(/^[0-9]{5}$/)).required(),
        email: joi.string().email({
            tlds: { allow: false },
            minDomainSegments: 2,
            maxDomainSegments: 3
        }).required(),
    }).required()
}).required()
export const loginSchema = joi.object({
    body: joi.object().keys({
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        email: joi.string().email({
            tlds: { allow: false },
            minDomainSegments: 2,
            maxDomainSegments: 3
        }).required(),
    }).required()
}).required()
export const forgetPasswordSchema = joi.object({
    body: joi.object().keys({
        email: joi.string().email({
            tlds: { allow: false },
            minDomainSegments: 2,
            maxDomainSegments: 3
        }).required(),
    }).required()
}).required()
export const resetPasswordSchema = joi.object({
    body: joi.object().keys({
        email: joi.string().email({
            tlds: { allow: false },
            minDomainSegments: 2,
            maxDomainSegments: 3
        }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        confirmPassword:joi.string().valid(joi.ref('password')),
        code: joi.string().pattern(new RegExp(/^[0-9]{5}$/)).required(),
    }).required()
}).required()