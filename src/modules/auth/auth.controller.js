import { Router } from "express";
import * as authService from "./service/auth.service.js"
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js"
const router=Router();

router.post('/signup',validation(validators.signupSchema),authService.signup)
router.post('/confirm-email',validation(validators.confirmEmailSchema),authService.confirmEmail)
router.post('/login',validation(validators.loginSchema),authService.login)
router.post('/refresh-token',authService.refreshToken)

export default router;