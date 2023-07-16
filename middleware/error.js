const ErrorHandler = require("../utils/ErrorHandler")


module.exports = (err , req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Interval server error"

    // wrong mongodb error 
    if(err.name === "CastError"){
        const message = `Resources not found with this id..Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Dublicate key Error
    if(err.code === 11000){
        const message = `Dublicate ${Object.keys(keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error 
    if (err.name === "JsonWebTokenError"){
        const message = "Your url is invalid please try again";
        err = new ErrorHandler(message, 400);
    }

    // Jwt expired error
    if(err.name === "TokenExpiredError") {
        const message = `Your url is ecpired please try again`;
        err = new ErrorHandler(message, 400);
    }

    res.statusCode(err.statusCode).json({
        success: false,
        message: err.message
    })
}