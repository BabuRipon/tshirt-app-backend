const User=require('../models/user');
const {validationResult} = require('express-validator');
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');

exports.checkEmail=(req,res,next)=>{
     User.findOne({email:req.body.email})
      .then(user=>{
          if(user)
            return res.json({err:"email is already in use"});
         next();
      })
      
}

exports.signup=(req,res)=>{
      
     const errors=validationResult(req);

     if(!errors.isEmpty()){
         return res.status(422).json({
             errorField:errors.array()[0].param,
             errorMsg:errors.array()[0].msg
         })
     }

      const user=new User(req.body)
      
      user.save((err,user)=>{
          if(err){
              return res.status(400).json({
                  err:"DB IS NOT SAVED"
              })
          }
          res.status(200).json({
              name:user.name,
              lastName:user.lastname,
              email:user.email,
              id:user._id
          })
      })
}

exports.signin=(req,res)=>{
    const {email,password}=req.body;

    const errors=validationResult(req);

     if(!errors.isEmpty()){
         return res.status(422).json({
             error:errors.array()[0].msg
         })
     }
    
     User.findOne({email},(err,user)=>{
         if(err || !user){
             return res.status(400).json({
                 error:"email is not found plaese signup"
             })
         }

         if(!user. autheticate(password)){
             return  res.status(400).json({
                error:"password not matched!"
            })
         }
    //create token
    const token=jwt.sign({_id:user._id},process.env.SECRET)
    //put token to coookie
      res.cookie('token',token,{expire:new Date()+9999});
      
    //send response to frontEnd

    const {_id,name,email,role}=user;
    res.json({token:token,user:{_id,name,email,role}});

     })

}

exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({message:"user logout successfully"});
}


//protected route

exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
})

//custom middleware

exports.isAuthenticated=(req,res,next)=>{
    
     const checker=req.profile&&req.auth&&req.profile._id == req.auth._id ;
     
    //  console.log(checker);
     if(!checker){
       return res.status(403).json({
           error:"ACCESS DENIED"
       })
     }
    next();
}

exports.isAdmin=(req,res,next)=>{

    if(req.profile.role==0){
      return res.status(403).json({
          error:"You are not admin,Access Denied"
      })
    }
   next();
}
