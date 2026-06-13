import { Router } from "express";
import * as budgetService from "./service/budget.service.js"
import * as validator from "./budget.validation.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
const router=Router();

router.post('/create-budget',authentication(),validation(validator.createBudget),budgetService.createBudget)
router.get('/all-budgets',authentication(),validation(validator.getBudgets),budgetService.getBudgets)
///////////////////////////test test test test//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/category/:categoryId',authentication(),validation(validator.getBudgetByCategory),budgetService.getBudgetByCategory)
router.get('/:budgetId',authentication(),validation(validator.getBudgetById),budgetService.getBudgetById)
router.patch('/update-budget/:budgetId',authentication(),validation(validator.updateBudget),budgetService.updateBudget)
router.delete('/delete-budget/:budgetId',authentication(),validation(validator.deleteBudget),budgetService.deleteBudget)
// Dashboard
router.get('/statistics',authentication(),budgetService.getBudgetStatistics)
export default router;