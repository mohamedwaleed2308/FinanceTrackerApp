import { Router } from "express";
import * as accountService from "./service/account.service.js"
import * as validator from "./account.validation.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = Router();

router.post('/create-account', authentication(), validation(validator.createAccount), accountService.createAccount)
router.get('/accounts', authentication(), accountService.allAccounts)
router.get('/:accountId', authentication(), accountService.getAccount)
router.patch('/:accountId', authentication(), validation(validator.updateAccount), accountService.updateAccount)
router.delete('/:accountId', authentication(), validation(validator.deleteAccount), accountService.deleteAccount)
router.patch('/:accountId/restore', authentication(), validation(validator.restoreAccount), accountService.restoreAccount)

router.get('/:accountId/transaction',authentication(),validation(validator.getAccountTransactions),accountService.getAccountTransactions)
// Dashboard
router.get('total-balance',authentication(),accountService.totalBalance)
export default router;

// GET /accounts/:accountId/transactions
// GET /accounts/summary
// GET /transactions/recent
// GET /transactions/category-summary
// GET /transactions/financial-summary
// POST /transactions/transfer