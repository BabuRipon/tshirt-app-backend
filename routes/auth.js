var express=require('express');
var router=express.Router();
const { check } = require('express-validator');

const {signout,signup,checkEmail,signin,isSignedIn}=require("../controllers/auth");

router.get('/signout',signout);

router.post('/signup',[
  check('name').isLength({min:3}).withMessage('must be in 3 chars long'),
  check('password').isLength({min:5}).withMessage('must be 5 chars long'),
  check('email').isEmail().withMessage('email is required')
], checkEmail,signup);

router.post("/signin",[
  check('password').isLength({min:5}).withMessage('must be 5 chars long and it required'),
  check('email').isEmail().withMessage('email is required')
],signin)

router.get('/testroute',isSignedIn,(req,res)=>{
  res.json(req.auth)
})


module.exports=router;