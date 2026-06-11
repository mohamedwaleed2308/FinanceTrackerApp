import joi from 'joi';
import { globalFields, paginationFields } from '../../globalFields.js';

export const createAccount = joi.object({
    body: joi.object({
        accountName: globalFields.accountName.required(),
        accountType: globalFields.accountType.required(),
        balance: globalFields.balance,
        currency: globalFields.currency,

    }).required()
})
export const getAccount = joi.object({
    params: joi.object({
        accountId: globalFields.id.required()
    }).required()
})
export const updateAccount = joi.object({
    params: joi.object({
        accountId: globalFields.id.required()
    }).required(),
    body: joi.object({
        accountName: globalFields.accountName,
        accountType: globalFields.accountType,
        balance: globalFields.balance,
        currency: globalFields.currency
    }).min(1).required()
})
export const deleteAccount = joi.object({
    params: joi.object({
        accountId: globalFields.id.required()
    }).required(),
})
export const restoreAccount = joi.object({
    params: joi.object({
        accountId: globalFields.id.required()
    }).required()
});
export const getAccountTransactions = joi.object({
    params: joi.object({
        accountId: globalFields.id.required()
    }).required(),
    query: joi.object({
        page: paginationFields.page,
        size: paginationFields.size
    })
});
