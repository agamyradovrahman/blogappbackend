const mongoose = require("mongoose");
require("dotenv").config()


const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log("database is connected")
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}


module.exports = connectDatabase