import { accountModel } from "../../../DB/models/Account.model.js";
import { budgetModel } from "../../../DB/models/Budget.model.js";
import { categoryModel } from "../../../DB/models/Category.model.js";
import { notificationModel } from "../../../DB/models/Notification.model.js";
import { statusTypes, transactionModel, transactionTypes } from "../../../DB/models/Transaction.model.js";
import { userModel } from "../../../DB/models/User.model.js";
import { sendEmail } from "../../../utilis/email/sendEmail.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import mongoose from 'mongoose';


export const createTransaction = asyncHandler(
    async (req, res, next) => {
        const { accountId, categoryId, title, shopName, amount, transactionType, note, date } = req.validatedData.body
        const account = await accountModel.findOne({
            _id: accountId,
            userId: req.user._id,
            deletedAt: null
        })
        const category = await categoryModel.findOne({
            _id: categoryId,
            userId: req.user._id,
            deletedAt: null
        })
        if (!account) {
            return next(new Error('account not found', { cause: 404 }))
        }
        if (!category) {
            return next(new Error('category not found', { cause: 404 }))
        }
        if (category.categoryType !== transactionType) {
            return next(new Error('Transaction type does not match category type', { cause: 400 }))
        }
        if (transactionType === transactionTypes.expense &&
            account.balance < amount
        ) {
            return next(new Error('Insufficient balance', { cause: 400 }))
        }
        if (transactionType == transactionTypes.income) {
            account.balance += amount
        }
        if (transactionType == transactionTypes.expense) {
            account.balance -= amount
        }
        // --------------- connect budget of category with transaction and notification----------
        const budget = await budgetModel.findOne({
            userId: req.user._id,
            categoryId,
            isActive: true,
            deletedAt: null
        });

        if (budget) {
            budget.spent += amount;
            const percentage = (budget.spent / budget.amount) * 100;

            if (percentage >= budget.alertThreshold &&
                !budget.alertSent
            ) {
                // Notification Later
                await notificationModel.create({
                    userId: req.user._id,
                    title: 'Budget Alert',
                    message: `Your budget has reached ${percentage.toFixed(2)}%`
                });
            }
            budget.alertSent = true;
            await budget.save();
            const user = await userModel.findById(
                req.user._id
            );

            await sendEmail({
                to: user.email,
                subject: 'Budget Alert',
                html: `
                    <h2>Budget Alert</h2>

                    <p>
                        Your budget reached
                        ${percentage.toFixed(2)}%
                    </p>
                    `
            });
        }
        // ---------- end --------------
        await account.save();
        const transaction = await transactionModel.create({
            userId: req.user._id,
            title,
            accountId,
            categoryId,
            shopName,
            amount,
            transactionType,
            note,
            date,
            status: statusTypes.completed
        })
        return successResponse({ res, status: 201, message: 'transaction created successfully', data: { transaction } })
    }
)
export const getTransaction = asyncHandler(
    async (req, res, next) => {
        const { page = 1, size = 10, transactionType, accountId, categoryId, startDate, endDate } = req.validatedData.query;
        const filter = {
            userId: req.user._id,
            deletedAt: null
        };

        if (transactionType) {
            filter.transactionType = transactionType;
        }

        if (accountId) {
            filter.accountId = accountId;
        }

        if (categoryId) {
            filter.categoryId = categoryId;
        }

        if (startDate || endDate) {

            filter.date = {};

            if (startDate) {
                filter.date.$gte = startDate;
            }

            if (endDate) {
                filter.date.$lte = endDate;
            }
        }

        const skip = (page - 1) * size;

        const totalTransactions =
            await transactionModel.countDocuments(filter);

        const transactions = await transactionModel
            .find(filter)
            .populate('accountId', 'accountName')
            .populate('categoryId', 'categoryName')
            .sort({ date: -1 })
            .skip(skip)
            .limit(size);

        return successResponse({
            res,
            message: 'Transactions retrieved successfully',
            data: {
                transactions,
                pagination: {
                    page,
                    size,
                    totalTransactions,
                    totalPages: Math.ceil(totalTransactions / size)
                }
            }
        });
    }
)
export const getTransactionById = asyncHandler(
    async (req, res, next) => {

        const { transactionId } = req.validatedData.params;

        const transaction = await transactionModel.findOne({
            _id: transactionId,
            userId: req.user._id,
            deletedAt: null
        }).populate(
            'accountId',
            'accountName accountType balance currency'
        ).populate(
            'categoryId',
            'categoryName categoryType'
        );

        if (!transaction) {
            return next(new Error('Transaction not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Transaction retrieved successfully', data: { transaction } });
    }
);
export const updateTransaction = asyncHandler(
    async (req, res, next) => {

        const { transactionId } = req.validatedData.params;
        const { title, shopName, categoryId, amount, note, date } = req.validatedData.body;

        const transaction = await transactionModel.findOne({
            _id: transactionId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!transaction) {
            return next(new Error('Transaction not found', { cause: 404 }));
        }

        const account = await accountModel.findById(transaction.accountId);

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        const oldAmount = transaction.amount;

        // remove old effect

        if (transaction.transactionType === transactionTypes.expense) {
            account.balance += oldAmount;
        }

        if (transaction.transactionType === transactionTypes.income) {
            account.balance -= oldAmount;
        }

        if (categoryId) {

            const category = await categoryModel.findOne({
                _id: categoryId,
                userId: req.user._id,
                deletedAt: null
            });

            if (!category) {
                return next(new Error('Category not found', { cause: 404 }));
            }

            if (category.categoryType !== transaction.transactionType) {
                return next(new Error('Category type mismatch', { cause: 400 }));
            }

            transaction.categoryId = categoryId;
        }

        if (title) {
            transaction.title = title;
        }
        if (shopName) {
            transaction.shopName = shopName;
        }
        if (note) {
            transaction.note = note;
        }
        if (date) {
            transaction.date = date;
        }
        if (amount) {
            transaction.amount = amount;
        }

        // apply new effect

        if (transaction.transactionType === transactionTypes.expense) {

            if (account.balance < transaction.amount) {
                return next(new Error('Insufficient balance', { cause: 400 }));
            }

            account.balance -= transaction.amount;
        }

        if (transaction.transactionType === transactionTypes.income) {
            account.balance += transaction.amount;
        }
        await account.save();
        await transaction.save();

        return successResponse({ res, message: 'Transaction updated successfully', data: { transaction } });
    }
);
export const deleteTransaction = asyncHandler(
    async (req, res, next) => {

        const { transactionId } = req.validatedData.params;

        const transaction = await transactionModel.findOne({
            _id: transactionId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!transaction) {
            return next(new Error('Transaction not found', { cause: 404 }));
        }

        const account = await accountModel.findOne({
            _id: transaction.accountId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        if (transaction.transactionType === transactionTypes.expense) {
            account.balance += transaction.amount;
        } else { // income
            account.balance -= transaction.amount;
        }

        await account.save();
        await transaction.deleteOne();

        return successResponse({ res, status: 200, message: 'Transaction deleted successfully' });
    }
);

// Dashboard
export const calculateTransactionOverview = async (userId) => {

    const transactions =await transactionModel.find({
            userId,
            deletedAt: null
        });

    const totalIncome =transactions.filter( transaction =>transaction.type ==='income')
            .reduce((sum, transaction) =>sum +transaction.amount,0);

    const totalExpense =transactions.filter( transaction =>transaction.type ==='expense')
            .reduce((sum, transaction) =>sum +transaction.amount,0);

    return {
        totalIncome,
        totalExpense,
        netSavings:totalIncome - totalExpense
    };
};
export const getRecentTransactions = async (userId, limit = 5) => {

    return await transactionModel.find({
            userId,
            deletedAt: null
        }).sort({
            createdAt: -1
        }).limit(limit).populate('categoryId','categoryName').populate('accountId','accountName');
};
export const calculateExpenseBreakdown = async (userId) => {

    return await transactionModel.aggregate([
        {
            $match: {
                userId:new mongoose.Types.ObjectId(userId ),
                type: 'expense'
            }
        },
        {
            $group: {
                _id: '$categoryId',
                totalAmount: {$sum: '$amount'}
            }
        },

        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }
        },

        {
            $unwind: '$category'
        },

        {
            $project: {
                _id: 0,
                categoryName:'$category.categoryName',
                totalAmount: 1
            }
        }
    ]);
};
export const calculateWeeklyComparison = async (userId) => {

    const now =new Date();
    const currentWeekStart =new Date(now);
    currentWeekStart.setDate( now.getDate() -now.getDay());
    currentWeekStart.setHours(0,0,0,0);
    const previousWeekStart =new Date(currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() -7);
    const previousWeekEnd =new Date(currentWeekStart);
    const currentWeekExpense =await transactionModel.aggregate([
            {
                $match: {
                    userId:new mongoose.Types.ObjectId(userId),
                    type:'expense',
                    createdAt: {
                        $gte:currentWeekStart
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {$sum:'$amount'}
                }
            }
        ]);

    const previousWeekExpense =await transactionModel.aggregate([
            {
                $match: {
                    userId:new mongoose.Types.ObjectId(userId),
                    type:'expense',
                    createdAt: {
                        $gte:previousWeekStart,
                        $lt:previousWeekEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {$sum:'$amount'}
                }
            }
        ]);

    const current =currentWeekExpense[0]?.total || 0;

    const previous =previousWeekExpense[0]?.total || 0;

    return {
        currentWeekExpense:current,

        previousWeekExpense: previous,

        changePercentage:
            previous === 0? 100: Number((((current -previous) /previous) *100).toFixed(2))
    };
};
// totalIncome - totalExpense - netSaving
export const transactionOverview = asyncHandler(
    async (req, res, next) => {

        const data =await calculateTransactionOverview(req.user._id);

        return successResponse({res,message: 'Transaction overview retrieved successfully',data});
    }
);
// recentTransaction
export const recentTransactions = asyncHandler(
    async (req, res, next) => {

        const { limit = 5 } = req.validatedData.query;

        const transactions = await getRecentTransactions(req.user._id, limit);

        return successResponse({ res, message: 'Recent transactions retrieved successfully', data: { transactions } });
    }
);
// expenseBreakdown
export const expenseBreakdown = asyncHandler(
    async (req, res, next) => {

        const breakdown = await calculateExpenseBreakdown(req.user._id);

        return successResponse({ res, message: 'Expense breakdown retrieved successfully', data: { breakdown } });
    }
);
// weeklyComparison
export const weeklyComparison = asyncHandler(
    async (req, res, next) => {

        const data = await calculateWeeklyComparison(req.user._id);

        return successResponse({ res, message: 'Weekly comparison retrieved successfully', data });
    }
);
