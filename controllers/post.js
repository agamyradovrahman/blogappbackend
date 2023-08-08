const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../models/post");
const Features = require("../utils/Features");
const cloudinary = require("cloudinary");

exports.Welcome = (req, res) => {
  res.json("Welcome");
};

exports.createpost = catchAsyncError(async (req, res, next) => {
  const { file } = req;

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    req.body.image = { url, public_id };
  } else {
    req.body.image = { url: "testing.com", public_id: 1 };
  }

  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    post,
  });
});

exports.getAdminpost = catchAsyncError(async (req, res, next) => {
  const post = await Post.find();

  res.status(200).json({
    success: true,
    post,
  });
});

// get All post
exports.getAllpost = catchAsyncError(async (req, res) => {
  const resultPerPage = 8;
  const category = req.body.category;

  const postCount = await Post.countDocuments();

  if (category) {
    const feature = new Features(Post.find({ category: category }), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const post = await feature.query;

    res.status(200).json({
      success: true,
      post,
      postCount,
      resultPerPage,
    });
  } else {
    const feature = new Features(Post.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const post = await feature.query;

    res.status(200).json({
      success: true,
      post,
      postCount,
      resultPerPage,
    });
  }
});

// Update post ---Admin
exports.updatepost = catchAsyncError(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("post is not found with this id", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Delete image from cloudinary
    for (let i = 0; i < post.images.length; i++) {
      await cloudinary.v2.uploader.destroy(post.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "post",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    post,
  });
});

// delete post
exports.deletepost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("post is not found with this id", 404));
  }

  // Deleting images from cloudinary
  for (let i = 0; 1 < post.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      post.images[i].public_id
    );
  }

  await post.remove();

  res.status(200).json({
    success: true,
    message: "post deleted succesfully",
  });
});

// single post details
exports.getSinglepost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("post is not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    post,
  });
});

exports.getAllpostpolitic = catchAsyncError(async (req, res) => {
  const resultPerPage = 8;
  const category = req.body.category;

  const postCount = await Post.countDocuments();

  const feature = new Features(Post.find({ category: "politic" }), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const post = await feature.query;

  res.status(200).json({
    success: true,
    post,
    postCount,
    resultPerPage,
  });
});




exports.getAllpostsport = catchAsyncError(async (req, res) => {
  const resultPerPage = 8;
  const category = req.body.category;

  const postCount = await Post.countDocuments();

  const feature = new Features(Post.find({ category: "sport" }), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const post = await feature.query;

  res.status(200).json({
    success: true,
    post,
    postCount,
    resultPerPage,
  });
});



exports.getAllposteconomic = catchAsyncError(async (req, res) => {
  const resultPerPage = 8;
  const category = req.body.category;

  const postCount = await Post.countDocuments();

  const feature = new Features(Post.find({ category: "economic" }), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const post = await feature.query;

  res.status(200).json({
    success: true,
    post,
    postCount,
    resultPerPage,
  });
});
