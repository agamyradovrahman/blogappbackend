const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/user");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken")

exports.register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (avatar) {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      user = await User.create({
        name,
        email,
        password,
        avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
      });

      sendToken(user, 201, res);
    }

    user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});


exports.userDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});




exports.updateUserRole = catchAsyncError(async(req,res,next) =>{
  const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
      success: true,
      user
  })
});



exports.deleteUser = catchAsyncError(async(req,res,next) =>{
  
  const user = await User.findById(req.params.id);

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

   if(!user){
       return next(new ErrorHandler("User is not found with this id",400));
   }

   await user.remove();

   res.status(200).json({
       success: true,
       message:"User deleted successfully"
   })
});



exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter the email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }

  sendToken(user, 201, res);
});





