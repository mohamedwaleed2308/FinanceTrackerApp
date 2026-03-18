import { Router } from "express";
import * as authService from "./service/auth.service.js"
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js"
const router=Router();

router.post('/signup',validation(validators.signupSchema),authService.signup)

export default router;