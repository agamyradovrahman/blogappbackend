const express = require("express");
const { Welcome, createpost, getAdminpost, getAllpost, updatepost, deletepost, getSinglepost } = require("../controllers/post");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router()


router.get("/home", Welcome)


router.route("/products").get(getAllpost);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminpost);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createpost);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updatepost)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deletepost)
  .get(getSinglepost);



module.exports = router