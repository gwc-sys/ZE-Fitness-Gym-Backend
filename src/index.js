import dotenv from "dotenv"
import connectDB from "./db/DBindex.js"
import { app } from "../src/app.js"

dotenv.config({ path: './env' })

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        })
        app.listen(process.env.PORT || 4000);
        console.log(`Server running at PORT : ${process.env.PORT}`);
    })
    .catch((err) => {
        console.log("MONGODB connection failed");
    })
