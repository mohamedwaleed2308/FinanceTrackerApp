import { Router } from "express";
import * as goalService from "./service/goal.service.js"
import * as validator from "./goal.validation.js"
import { authentication } from './../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
const router=Router();

router.post('/create-goal',authentication(),validation(validator.createGoal),goalService.createGoal)
router.get('/all-goals',authentication(),validation(validator.getGoals),goalService.getGoals)
router.get('/:goalId',authentication(),validation(validator.getGoalById),goalService.getGoalById)
router.patch('/update-goal/:goalId',authentication(),validation(validator.updateGoal),goalService.updateGoal)
router.patch('/add-funds/:goalId',authentication(),validation(validator.addFunds),goalService.addFunds)
router.delete('/delete-goal/:goalId',authentication(),validation(validator.deleteGoal),goalService.deleteGoal)
//Dashboard
router.get('/statistics',authentication())
export default router;