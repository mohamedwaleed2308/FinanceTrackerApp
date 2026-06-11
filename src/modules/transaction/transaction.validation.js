import joi from "joi";
import { globalFields, paginationFields } from "../../globalFields.js";

export const createTransaction = joi.object({
    body: joi.object({
        accountId: globalFields.id.required(),
        categoryId: globalFields.id.required(),
        title:globalFields.title.required(),
        shopName:globalFields.shopName.required(),
        amount: globalFields.amount.required(),
        transactionType: globalFields.transactionType.required(),
        note: globalFields.note,
        date: globalFields.date.required()
    }).required()
});
export const getTransaction = joi.object({
    query: joi.object({
        page:paginationFields.page,
        size:paginationFields.size,
        transactionType:globalFields.transactionType,
        accountId: globalFields.id,
        categoryId: globalFields.id,
        startDate: paginationFields.startDate,
        endDate: paginationFields.endDate
    }).required()
});
export const getTransactionById = joi.object({
    params: joi.object({
        transactionId:globalFields.id.required()
    }).required()
});
export const updateTransaction = joi.object({
    params: joi.object({
        transactionId:globalFields.id.required()
    }).required(),
    body: joi.object({
        categoryId: globalFields.id.required(),
        title:globalFields.title.required(),
        shopName:globalFields.shopName.required(),
        amount: globalFields.amount.required(),
        note: globalFields.note,
        date: globalFields.date.required()
    }).required()
});
export const deleteTransaction = joi.object({
    params: joi.object({
        transactionId:globalFields.id.required()
    }).required(),
});

