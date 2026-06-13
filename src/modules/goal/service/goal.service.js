import { accountModel } from "../../../DB/models/Account.model.js";
import { savingGoalModel } from "../../../DB/models/SavingGoals.model.js";
import { transactionModel } from "../../../DB/models/Transaction.model.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { asyncHandler } from './../../../utilis/response/error.response.js';


export const createGoal = asyncHandler(
    async (req, res, next) => {

        const { goalName, targetAmount, targetDate, priority } = req.validatedData.body;

        const isExist = await savingGoalModel.findOne({
            userId: req.user._id,
            goalName: {
                $regex: `^${goalName}$`,
                $options: 'i'
            },
            deletedAt: null
        });

        if (isExist) {
            return next(new Error('Goal name already exists', { cause: 409 }));
        }

        const goal = await savingGoalModel.create({
            userId: req.user._id,
            goalName,
            targetAmount,
            targetDate,
            priority
        });

        return successResponse({ res, status: 201, message: 'Goal created successfully', data: { goal } });
    }
);
export const getGoals = asyncHandler(
    async (req, res, next) => {

        const { page = 1, size = 10, isCompleted, priority } = req.validatedData.query;

        const filter = {
            userId: req.user._id,
            deletedAt: null
        };

        if (isCompleted) {
            filter.isCompleted = isCompleted;
        }

        if (priority) {
            filter.priority = priority;
        }

        const skip = (page - 1) * size;

        const goals = await savingGoalModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(size);

        const totalCount = await savingGoalModel.countDocuments(filter);

        return successResponse({
            res, message: 'Goals retrieved successfully',
            data: {
                goals,
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
export const getGoalById = asyncHandler(
    async (req, res, next) => {

        const { goalId } = req.validatedData.params;

        const goal = await savingGoalModel.findOne({
            _id: goalId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!goal) {
            return next(new Error('Goal not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Goal retrieved successfully', data: { goal } });
    }
);
export const updateGoal = asyncHandler(
    async (req, res, next) => {

        const { goalId } = req.validatedData.params;
        const { goalName, targetAmount, targetDate, priority } = req.validatedData.body;

        const goal = await savingGoalModel.findOne({
            _id: goalId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!goal) {
            return next(new Error('Goal not found', { cause: 404 }));
        }


        if (goalName) {

            const isExist = await savingGoalModel.findOne({
                _id: { $ne: goalId },
                userId: req.user._id,
                goalName: {
                    $regex: `^${goalName}$`,
                    $options: 'i'
                },
                deletedAt: null
            });

            if (isExist) {
                return next(new Error('Goal name already exists', { cause: 409 }));
            }

            goal.goalName = goalName;
        }

        if (targetAmount) {
            if (targetAmount < goal.currentAmount) {
                return next(new Error('Target amount cannot be less than current amount', { cause: 400 }));
            }

            goal.targetAmount = targetAmount;

            goal.isCompleted = goal.currentAmount >= targetAmount;
        }

        if (targetDate) {
            goal.targetDate = targetDate;
        }

        if (priority) {
            goal.priority = priority;
        }

        await goal.save();

        return successResponse({ res, status: 200, message: 'Goal updated successfully', data: { goal } });
    }
);
export const addFunds = asyncHandler(
    async (req, res, next) => {

        const { goalId } = req.validatedData.params;
        const { amount, accountId } = req.validatedData.body;

        const goal = await savingGoalModel.findOne({
            _id: goalId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!goal) {
            return next(new Error('Goal not found', { cause: 404 }));
        }

        if (goal.isCompleted) {
            return next(new Error('Goal is already completed', { cause: 400 }));
        }
        const account = await accountModel.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        if (account.balance < amount) {
            return next(new Error('Insufficient account balance', { cause: 400 }));
        }

        const newAmount = goal.currentAmount + amount;

        if (newAmount > goal.targetAmount) {
            return next(new Error(`Amount exceeds target by ${newAmount - goal.targetAmount}`, { cause: 400 }));
        }
        account.balance -= amount;
        goal.currentAmount = newAmount;

        if (goal.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true;
        }

        await account.save()
        await goal.save();
        await transactionModel.create({
            userId: req.user._id,
            accountId: account._id,
            title: goal.goalName,
            amount,
            date: goal.updatedAt,
            transactionType: 'expense',
            description: `Transfer to goal (${goal.goalName})`
        });
        // progress to make a percentage for currentAmount
        const progress = (goal.currentAmount / goal.targetAmount) * 100;

        return successResponse({
            res, message: 'Funds added successfully',
            data: {
                goal,
                progress: Number(
                    progress.toFixed(2)
                )
            }
        });
    }
);
export const deleteGoal = asyncHandler(
    async (req, res, next) => {

        const { goalId } = req.validatedData.params;

        const goal = await savingGoalModel.findById(goalId);

        if (!goal) {
            return next(new Error('Goal not found', { cause: 404 }));
        }
        await goal.deleteOne();
        return successResponse({ res, message: 'Goal deleted successfully' });
    }
);