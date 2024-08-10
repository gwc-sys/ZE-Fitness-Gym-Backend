import express from "express"
import cors from "cors";
import morgan from 'morgan';
import cookieParser from "cookie-parser"

const app = express();
app.use(cors({
    origin: 'http://10.0.2.2:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));    
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended : true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// Use morgan to log requests
app.use(morgan('dev'));

// Routes 
import userRouter from "../src/routes/user.route.js"
import showUser from "../src/routes/showUser.routes.js"
// routes declaration  
app.use('/api/v1/users',userRouter)

//http://localhost:4000/api/v1/users/register

app.use('/api/v1/users', showUser) 
//http://localhost:4000/api/v1/users/show












// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export {app}