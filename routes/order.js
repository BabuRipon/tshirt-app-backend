const express=require('express');
const router=express.Router();

const {isAdmin,isAuthenticated,isSignedIn}=require("../controllers/auth");
const {getUserById,pushOrderInPurchaseList}=require('../controllers/user');
const {updateStock}=require('../controllers/product');

const {getOrderById,createOrder,getAllOrders,updateStatus,getOrderStatus}=require("../controllers/order");

//param route

router.param("/userId",getUserById);
router.param("/orderId",getOrderById);

//actual route

// create

router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);

// read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);


module.exports=router;