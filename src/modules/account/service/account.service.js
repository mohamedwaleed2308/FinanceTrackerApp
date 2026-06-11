import { accountModel } from "../../../DB/models/Account.model.js";
import { transactionModel } from "../../../DB/models/Transaction.model.js";
import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";


export const createAccount = asyncHandler(
    async (req, res, next) => {
        const { accountName, accountType, balance, currency } = req.validatedData.body;

        const isExist = await accountModel.findOne({
            userId: req.user._id,
            accountName: {
                $regex: `^${accountName}$`,
                $options: 'i'// this for ignore case sensetive
            }
        });
        if (isExist) {
            return next(new Error('Account name already exists', { cause: 409 }));
        }
        const account = await accountModel.create({
            userId: req.user._id,
            accountName,
            accountType,
            balance,
            currency,
        });

        return successResponse({ res, status: 201, message: 'Account created successfully', data: { account } })
    }
)
export const getAccount = asyncHandler(
    async (req, res, next) => {
        const { accountId } = req.validatedData.params;

        const account = await accountModel.findOne({
            _id: accountId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        return successResponse({ res, status: 200, message: 'Account retrieved successfully', data: { account } });
    }
)
export const allAccounts = asyncHandler(
    async (req, res, next) => {
        const accounts = await accountModel.find({
            userId: req.user._id,
            deletedAt: null
        });

        return successResponse({ res, status: 200, message: 'Accounts retrieved successfully', data: { accounts } });

    }
)
export const updateAccount = asyncHandler(
    async (req, res, next) => {
        const { accountId } = req.validatedData.params;

        const { accountName, accountType, balance, currency } = req.validatedData.body;

        const account = await accountModel.findOne({
            _id: accountId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        if (accountName) {

            const isExist = await accountModel.findOne({
                _id: { $ne: accountId },
                userId: req.user._id,
                accountName: {
                    $regex: `^${accountName}$`,
                    $options: 'i'
                }
            });

            if (isExist) {
                return next(new Error('Account name already exists', { cause: 409 }));
            }
        }

        if (accountName !== undefined)
            account.accountName = accountName;

        if (accountType !== undefined)
            account.accountType = accountType;

        if (balance !== undefined)
            account.balance = balance;

        if (currency !== undefined)
            account.currency = currency;

        await account.save();

        return successResponse({ res, message: 'Account updated successfully', data: { account } });
    }
)
export const deleteAccount = asyncHandler(
    async (req, res, next) => {
        const { accountId } = req.validatedData.params;

        const account = await accountModel.findOneAndUpdate(
            {
                _id: accountId,
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

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }
        return successResponse({ res, status: 200, message: 'Account deleted successfully' });
    }
)
export const restoreAccount = asyncHandler(
    async (req, res, next) => {

        const { accountId } = req.validatedData.params;

        const account = await accountModel.findOneAndUpdate(
            {
                _id: accountId,
                userId: req.user._id,
                deletedAt: { $ne: null }
            },
            {
                deletedAt: null
            },
            {
                new: true
            }
        );

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        return successResponse({ res, message: 'Account restored successfully', data: { account } });
    }
);


// -------------##--------------
export const getAccountTransactions = asyncHandler(
    async (req, res, next) => {

        const { accountId } = req.validatedData.params;

        const { page = 1, size = 10 } = req.validatedData.query;

        const account = await accountModel.findOne({
            _id: accountId,
            userId: req.user._id,
            deletedAt: null
        });

        if (!account) {
            return next(new Error('Account not found', { cause: 404 }));
        }

        const skip = (page - 1) * size;

        const totalTransactions = await transactionModel.countDocuments({
            accountId,
            userId: req.user._id
        });

        const transactions =
            await transactionModel.find({
                accountId,
                userId: req.user._id
            }).populate(
                'categoryId',
                'categoryName categoryType'
            ).sort({ date: -1 }).skip(skip).limit(size);

        return successResponse({res, message: 'Account transactions retrieved successfully',
            data: {
                account,
                transactions,
                pagination: {
                    page,
                    size,
                    totalTransactions,
                    totalPages: Math.ceil(
                        totalTransactions / size
                    )
                }
            }
        });
    }
);
