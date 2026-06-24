import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"


const app=express()

app.use(
  cors({
    origin: [
      "https://ai-assistance-2.onrender.com",
      "http://localhost:3000", // if React app runs on port 3000
      "http://127.0.0.1:3000",
      "http://localhost:5173", // if Vite app runs on port 5173
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port,()=>{
    connectDb()
    console.log("server started")
})
