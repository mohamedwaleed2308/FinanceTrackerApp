import DBconnection from "./DB/DB.connection.js"
import { userModel } from "./DB/models/User.model.js"
import authController from "./modules/auth/auth.controller.js"
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

//not-found page
app.use((req,res,next)=>{return res.status(404).json({message:'Page Not Found'})})

//DBConnection
DBconnection()
// globalErrorHandeling
app.use(globalErrorHandeling)

}