import { asyncHandler } from "../../../utilis/response/error.response.js";
import { successResponse } from "../../../utilis/response/success.response.js";
import { calculateTotalBalance } from "../../account/service/account.service.js";
import { calculateBudgetStatistics } from "../../budget/service/budget.service.js";
import { calculateGoalStatistics } from "../../goal/service/goal.service.js";
import { calculateExpenseBreakdown, calculateTransactionOverview, calculateWeeklyComparison, getRecentTransactions } from "../../transaction/service/transaction.service.js";


export const getDashboard = asyncHandler(
    async (req, res, next) => {

        const userId = req.user._id;

        const [
            totalBalance,
            overview,
            recentTransactions,
            expenseBreakdown,
            weeklyComparison,
            goalSummary,
            budgetSummary
        ] = await Promise.all([
            calculateTotalBalance(userId),
            calculateTransactionOverview(userId),
            getRecentTransactions(userId, 5),
            calculateExpenseBreakdown(userId),
            calculateWeeklyComparison(userId),
            calculateGoalStatistics(userId),
            calculateBudgetStatistics(userId)
        ]);

        return successResponse({
            res, message: 'Dashboard retrieved successfully', data: {
                overview: {
                    ...overview,
                    ...totalBalance
                },
                recentTransactions,
                expenseBreakdown,
                weeklyComparison,
                goalSummary,
                budgetSummary
            }
        });

    }
);