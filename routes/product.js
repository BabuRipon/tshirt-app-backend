const express=require('express');
const router=express.Router();

const {getProductById,createProduct,getProduct,getphoto,deleteProduct,updateProduct,getAllProducts,getAllUniqueCategories}=require("../controllers/product")
const {isAdmin,isSignedIn,isAuthenticated}=require("../controllers/auth")
const {getUserById}=require("../controllers/user")

//all of param 
router.param("userId",getUserById);
router.param("productId",getProductById);

//all of actual route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)

//read route
router.get("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,getProduct)
router.get("/product/:productId",getphoto);

// update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

//listing route
router.get("/products",getAllProducts)

router.get("/products/categories",getAllUniqueCategories)

module.exports=router;