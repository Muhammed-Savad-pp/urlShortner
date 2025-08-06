import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import user_route from "./routes/userRoutes";
import url_route from "./routes/urlRoutes";
dotenv.config();

const port = process.env.PORT;
const frontentUrl = process.env.FRONTENT_URL;
const mongoUrl = process.env.MONGO_URL ??''  

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: frontentUrl,
    credentials: true,
}))

app.use('/api/auth', user_route);
app.use('/api/url', url_route)

mongoose
    .connect(mongoUrl)
    .then(() => console.log('MongDB connected'))
    .catch((err) => console.log(err))


app.listen(port, () => {
    console.log(`server is Running on http://localhost:${port}`);
})

