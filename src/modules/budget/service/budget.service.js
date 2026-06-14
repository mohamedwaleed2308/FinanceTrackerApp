import { budgetModel } from "../../../DB/models/Budget.model.js";
import { categoryModel } from "../../../DB/models/Category.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";

export const createBudget = asyncHandler(
    async (req, res, next) => {

        const { categoryId, amount, interval, startDate, endDate, alertThreshold } = req.validatedData.body;

        const category = await categoryModel.findOne({
            _id: categoryId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!category) {
            return next(new Error('Category not found', { cause: 404 }));
        }

        const isExist = await budgetModel.findOne({
            userId: req.user._id,
            categoryId,
            interval,
            deletedAt: null
        });

        if (isExist) {
            return next(new Error('Budget already exists for this category and interval', { cause: 409 }));
        }

        const budget = await budgetModel.create({
            userId: req.user._id,
            categoryId,
            amount,
            interval,
            startDate,
            endDate,
            alertThreshold
        });

        return successResponse({ res, status: 201, message: 'Budget created successfully', data: { budget } });
    }
);
export const getBudgets = asyncHandler(
    async (req, res, next) => {

        const { page = 1, size = 10, interval } = req.validatedData.query;

        const filter = {
            userId: req.user._id,
            deletedAt: null,
            isActive: true
        };

        if (interval) {
            filter.interval = interval;
        }

        const skip = (page - 1) * size;

        const budgets = await budgetModel
            .find(filter)
            .populate('categoryId', 'categoryName icon')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(size);

        const totalCount = await budgetModel.countDocuments(filter);

        return successResponse({
            res, message: 'Budgets retrieved successfully',
            data: {
                budgets,
                pagination: {
                    page,
                    size,
                    totalCount,
                    totalPages:
                        Math.ceil(totalCount / size)
                }
            }
        });
    }
);
export const getBudgetByCategory = asyncHandler(
    async (req, res, next) => {

        const { categoryId } = req.validatedData.params;

        const budget = await budgetModel.findOne({
            userId: req.user._id,
            categoryId,
            deletedAt: null
        }).populate('categoryId', 'categoryName');

        if (!budget) {
            return next(new Error('Budget not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Budget retrieved successfully', data: { budget } });
    }
);
export const getBudgetById = asyncHandler(
    async (req, res, next) => {

        const { budgetId } = req.validatedData.params;

        const budget = await budgetModel.findOne({
            _id: budgetId,
            userId: req.user._id,
            deletedAt: null
        }).populate('categoryId', 'categoryName ');

        if (!budget) {
            return next(new Error('Budget not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Budget retrieved successfully', data: { budget } });
    }
);
export const updateBudget = asyncHandler(
    async (req, res, next) => {

        const { budgetId } = req.validatedData.params;
        const { amount, interval, alertThreshold, startDate, endDate, } = req.validatedData.body;

        const budget = await budgetModel.findOne({
            _id: budgetId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!budget) {
            return next(new Error('Budget not found', { cause: 404 }));
        }

        if (amount && amount < budget.spent) {
            return next(new Error('Amount cannot be less than spent amount', { cause: 400 }));
        }

        if (amount) {
            budget.amount = amount
        }
        if (startDate) {
            budget.startDate = startDate
        }
        if (endDate) {
            budget.endDate = endDate
        }
        if (interval) {
            budget.interval = interval
        }
        if (alertThreshold) {
            budget.alertThreshold = alertThreshold
        }

        await budget.save();

        return successResponse({ res, message: 'Budget updated successfully', data: { budget } });
    }
);
export const deleteBudget = asyncHandler(
    async (req, res, next) => {

        const { budgetId } = req.validatedData.params;

        const budget = await budgetModel.findOneAndUpdate(
            {
                _id: budgetId,
                userId: req.user._id,
                deletedAt: null
            },
            {
                deletedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!budget) {
            return next(new Error('Budget not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Budget deleted successfully' });
    }
);

// Dashboard
export const calculateBudgetStatistics = async (userId) => {

    const budgets = await budgetModel.find({
        userId,
        deletedAt: null
    });

    const totalBudget = budgets.reduce((sum, budget) =>sum + budget.amount, 0);

    const totalSpent = budgets.reduce((sum, budget) =>sum + budget.spent, 0);

    const remaining = totalBudget - totalSpent;

    const usagePercentage = totalBudget > 0 ? Number((totalSpent / totalBudget * 100).toFixed(2)) : 0;

    return {
        totalBudget,
        totalSpent,
        remaining,
        usagePercentage
    };
};

export const getBudgetStatistics = asyncHandler(
    async (req, res, next) => {

        const data = await calculateBudgetStatistics(req.user._id);

        return successResponse({ res, message: 'Budget statistics retrieved successfully', data });
    }
);