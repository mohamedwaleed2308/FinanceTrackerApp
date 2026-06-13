import joi from "joi";
import { globalFields, paginationFields } from "../../globalFields.js";

export const createGoal = joi.object({
    body: joi.object({
        goalName: globalFields.goalName.required(),
        targetAmount: globalFields.targetAmount.required(),
        targetDate: globalFields.targetDate,
        priority: globalFields.priority.default('optional')
    }).required()
});
export const getGoals = joi.object({
    query: joi.object({
        page: paginationFields.page,
        size: paginationFields.size,
        isCompleted: joi.boolean(),
        priority: globalFields.priority
    })
});
export const getGoalById = joi.object({
    params: joi.object({
        goalId: globalFields.id.required()
            .required()
    }).required()
});
export const updateGoal = joi.object({
    params: joi.object({
        goalId: globalFields.id.required()
    }).required(),
    body: joi.object({
        goalName: globalFields.goalName,
        targetAmount: globalFields.targetAmount,
        targetDate: globalFields.targetDate,
        priority: globalFields.priority
    }).min(1).required()
});

export const addFunds = joi.object({
    params: joi.object({
        goalId: globalFields.id.required()
    }).required(),
    body: joi.object({
        accountId:globalFields.id.required(),
        amount: globalFields.amount.required()
    }).required()
});
export const deleteGoal = joi.object({
    params: joi.object({
        goalId: globalFields.id.required()
    }).required()
});