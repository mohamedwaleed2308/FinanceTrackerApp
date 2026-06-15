import mongoose from "mongoose";

const DBconnection = () => {
    mongoose.connect(process.env.DB_URL).
    then(() => {
            console.log('DB connected successfully')}).
    catch(()=>{
        console.log('DB not connected');
        
    })
}

export default DBconnection;