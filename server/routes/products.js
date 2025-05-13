const productController = require("../controllers/products");
var express = require("express");
var router = express.Router();
const multer = require('multer');


router.post("/createProduct", productController.upload, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.upload, productController.updateProducts);
router.delete("/:id", productController.deleteProducts);


module.exports = router
