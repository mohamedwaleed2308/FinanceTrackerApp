import DBconnection from "./DB/DB.connection.js"
import { userModel } from "./DB/models/User.model.js"
import authController from "./modules/auth/auth.controller.js"
import userController from "./modules/user/user.controller.js"
import categoryController from "./modules/category/category.controller.js"
import budgetController from "./modules/budget/budget.controller.js"
import accountController from "./modules/account/account.controller.js"
import transactionController from "./modules/transaction/transaction.controller.js"
import goalController from "./modules/goal/goal.controller.js"
import reportController from "./modules/report/report.controller.js"
import systemUtilityController from "./modules/system&utility/system&utility.controller.js"
import recurringRulesController from "./modules/recurring rules/recurring rules.controller.js"
import { globalErrorHandeling } from "./utilis/response/error.response.js"


export const Bootstrap=(app,express)=>{
// convert buffer to data
app.use(express.json())
//graphQl APIs
//app-routing
app.get('/',(req,res,next)=>{return res.status(200).json({message:'Done'})})
app.get('/create',(req,res,next)=>{

    userModel.create({userName:'mohamd',email:'memowalied323@gmail.com',password:'123456',monthly_budget:5000})
})
//sub-routing
app.use('/auth',authController)
app.use('/user',userController)
app.use('/account',accountController)
app.use('/transaction',transactionController)
app.use('/budget',budgetController)
app.use('/goal',goalController)
app.use('/system-utility',systemUtilityController)
app.use('/report',reportController)
app.use('/recurring-rules',recurringRulesController)
app.use('/category',categoryController)

//not-found page
app.use((req,res,next)=>{return res.status(404).json({message:'Page Not Found'})})

//DBConnection
DBconnection()
// globalErrorHandeling
app.use(globalErrorHandeling)

}