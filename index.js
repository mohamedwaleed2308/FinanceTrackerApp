import express from "express"
import * as dotenv from "dotenv"
import path from "path"
import {Bootstrap} from "./src/app.controller.js"
dotenv.config({path:path.resolve("./src/config/.env")})
const app = express()
const port =process.env.PORT || 5000
// const port = 3000

Bootstrap(app,express)

app.listen(port,()=>console.log(`app listening success in port == ${port}`))
