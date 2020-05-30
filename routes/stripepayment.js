const express=require('express');
const router=express.Router();

const {makestripepayment}=require('../controllers/stripepayment')


router.post("/stripepayment",makestripepayment)

module.exports=router;