import 'dotenv/config'
import "./database/connectDB.js"
import express from "express";
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import postRoute from "./routes/post.route.js"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter)
app.use("/api/v1/post", postRoute)

//solo para el ejemplo de login y token

app.use(express.static('public'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("http://localhost:"+ PORT))
