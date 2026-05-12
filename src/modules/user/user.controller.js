import { Router } from "express";
import * as userService from "./service/user.service.js"
import * as validator from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/authentication.middleware.js";

const router=Router();
router.get('/profile',authentication(),userService.profile)
router.put('/profile',validation(validator.updateSchema),authentication(),userService.updateProfile)
router.put('/profile/settings',validation(validator.settingsSchema),authentication(),userService.profileSettings)
router.patch('/profile/password',validation(validator.changePasswordSchema),authentication(),userService.changePassword)
router.delete('/profile',authentication(),userService.deleteProfile)


export default router;