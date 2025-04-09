import connectDb from "./config/db.js";
import { app } from "./app.js"
import dotenv from "dotenv"

dotenv.config()

try {
    connectDb()
    const port = 8000
    app.listen(process.env.PORT || port, () => {
        console.log(`Server is listening on  port ${process.env.PORT || port}`)
    })
    app.on("error", (err) => {
        console.log("Server is not listening", err)
        throw err
    })
} catch (error) {
    console.error("MONGO DB connection failed", err)
}

