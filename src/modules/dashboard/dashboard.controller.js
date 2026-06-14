import { Router } from "express";
import * as dashboardService from "./service/dashboard.service.js"
import { authentication } from "../../middleware/authentication.middleware.js";
const router=Router();

router.get('/',authentication(),dashboardService.getDashboard)
export default router