import joi from "joi";
import { currencyTypes, languageType, themeType } from "./DB/models/User.model.js";

export const globalFields = {
    userName: joi.string().min(4).max(30),
    email: joi.string().email({
        tlds: { allow: false },
        minDomainSegments: 2,
        maxDomainSegments: 3
    }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    language: joi.string().valid(...Object.values(languageType)),
    currency: joi.string().valid(...Object.values(currencyTypes)),
    code: joi.string().pattern(new RegExp(/^[0-9]{5}$/)),
    confirmPassword:joi.string().valid(joi.ref('password')),
    theme:joi.string().valid(...Object.values(themeType))
}