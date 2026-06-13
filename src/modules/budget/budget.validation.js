import joi from "joi";
import { globalFields, paginationFields } from "../../globalFields.js";

export const createBudget = joi.object({
    body: joi.object({
        categoryId: globalFields.id.required(),
        amount: globalFields.amount.required(),
        interval: globalFields.interval.required(),
        startDate: paginationFields.startDate,
        endDate: paginationFields.endDate,
        alertThreshold: globalFields.alertThreshold
    }).required()
});
export const getBudgets = joi.object({
    query: joi.object({
        page: paginationFields.page,
        size: paginationFields.size,
        interval: globalFields.interval,
    })
});
export const getBudgetById = joi.object({
    params: joi.object({
        budgetId: globalFields.id.required()
    })
});
export const updateBudget = joi.object({

    params: joi.object({
        budgetId: globalFields.id.required(),
    }).required(),
    body: joi.object({
        amount: globalFields.amount,
        interval: globalFields,
        alertThreshold: globalFields.alertThreshold,
        startDate: paginationFields.startDate,
        endDate: paginationFields.endDate,
    }).min(1).required()
});
export const deleteBudget = joi.object({
    params: joi.object({
        budgetId: globalFields.id.required()
    }).required()
});
export const getBudgetByCategory = joi.object({
    params: joi.object({
        categoryId: globalFields.id.required()
    }).required()
});