const mongoose = require("mongoose");
require("dotenv").config()


const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect("mongodb+srv://rahman1205:rahman1205@cluster0.rwzzweg.mongodb.net/?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log("database is connected")
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}


module.exports = connectDatabase