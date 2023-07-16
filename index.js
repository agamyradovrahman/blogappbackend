const  express = require("express");
const connectDatabase = require("./db");
const postRoutes = require("./routers/posts")
const userRoutes = require("./routers/user")
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());


connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use("/posts", postRoutes)
app.use("/user", userRoutes)

app.listen(5000, () => {
    console.log("server running");
})
