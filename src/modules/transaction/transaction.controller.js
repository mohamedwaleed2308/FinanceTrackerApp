import { Router } from "express";
import * as transactionService from "./service/transaction.service.js"
import * as validator from "./transaction.validation.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";

const router=Router();

router.post('/create-transaction',authentication(),
validation(validator.createTransaction),transactionService.createTransaction)
router.get('/get-transactions',authentication(),
validation(validator.getTransaction),transactionService.getTransaction)
router.get('/specific-transaction/:transactionId',authentication(),
validation(validator.getTransactionById),transactionService.getTransactionById)
router.patch('/update-transaction/:transactionId',authentication(),
validation(validator.updateTransaction),transactionService.updateTransaction)
router.delete('/delete-transactio/:transactionId',authentication(),validation(validator.deleteTransaction))

// Dashboard 
router.get('/overview',authentication(),transactionService.transactionOverview)
router.get('/recent',authentication(),validation(validator.recentTransactions),transactionService.recentTransactions)
router.get('/weekly-comparison',authentication(),)
// Dashboard (pie Chart)
router.get('/expense-breakdown',authentication(),transactionService.expenseBreakdown)
export default router;

// expenseBreakdown example for pie chart #####
// {
//     "breakdown":[
//         {
//             "categoryName":"Food",
//             "totalAmount":3000
//         },
//         {
//             "categoryName":"Transport",
//             "totalAmount":1200
//         }
//     ]
// }
// ##########
// get-transaction
// GET /transactions?transactionType=(expense,income)
// GET /transactions?accountId=6843d4f6f1c7a8b9d0e1f2a spicific account
// GET /transactions?startDate=2026-06-01&endDate=2026-06-30 spicific interval of time
// pagination
// GET /transactions?page=2&size=20
