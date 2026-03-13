import mongoose from "mongoose";

const DBconnection = () => {
    mongoose.connect("mongodb://localhost:27017/FinanceTracker").
    then(() => {
            console.log('DB connected successfully')}).
    catch(()=>{
        console.log('DB not connected');
        
    })
}

export default DBconnection;