import { Router } from "express";
import * as userService from "./service/user.service.js"
import * as validator from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/authentication.middleware.js";

const router=Router();
router.get('/profile',authentication(),userService.profile)
router.put('/update-profile',authentication(),userService.profile)


export default router;