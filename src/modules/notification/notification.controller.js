import { Router } from "express";
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validator from "./notification.validation.js"
import * as notificatoinService from "./service/notification.service.js"
const router=Router()

router.get('/',authentication(),validation(validator.getNotifications),notificatoinService.getNotifications)
router.patch('/read/:notificationId',authentication(),validation(validator.markAsRead),notificatoinService.markAsRead)
router.delete('/:notificationId',authentication(),validation(validator.deleteNotification),notificatoinService.deleteNotification)

export default router