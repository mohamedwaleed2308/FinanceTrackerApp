import joi from "joi";
import mongoose from "mongoose";
import { currencyTypes, languageType, themeType } from "./DB/models/User.model.js";
import { accountType } from "./DB/models/Account.model.js";
import { categoryTypes } from "./DB/models/Category.model.js";
import { transactionTypes } from "./DB/models/Transaction.model.js";

export const validationObjectId = (value, helper) => {
    return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helper.message("Invalid ObjectId");
};


export const globalFields = {
    id: joi.string().custom(validationObjectId),
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
    confirmPassword: joi.string().valid(joi.ref('password')),
    theme: joi.string().valid(...Object.values(themeType)),
    accountName: joi.string().trim().min(4).max(50),
    accountType: joi.string().valid(...Object.values(accountType)),
    balance: joi.number().min(0),
    currency: joi.string().valid(...Object.values(currencyTypes)),
    categoryType: joi.string().valid(...Object.values(categoryTypes)),
    categoryName: joi.string().trim().min(2).max(50),
    amount: joi.number().positive(),
    transactionType: joi.string().valid(...Object.values(transactionTypes)),
    note: joi.string().max(500),
    date: joi.date(),
    title: joi.string().min(4).max(25),
    shopName: joi.string().min(4).max(25),
}
export const paginationFields = {
    page: joi.number().integer().min(1).default(1),
    size: joi.number().integer().min(1).max(100).default(10),
    startDate: joi.date(),
    endDate: joi.date()
}

