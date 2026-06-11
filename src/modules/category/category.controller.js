import { Router } from "express";
import * as categoryService from "./service/category.service.js"
import * as validator from "./category.validation.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
const router=Router();

router.get('/all-categories',authentication(),validation(validator.getCategories),categoryService.getCategories)
router.post('/create',authentication(),validation(validator.createCategory),categoryService.createCategory)
router.patch('/update-category/:categoryId',authentication(),validation(validator.updateCategory),categoryService.updateCategory)
router.delete('/delete-category/:categoryId',authentication(),validation(validator.deleteCategory),categoryService.deleteCategory)

export default router;