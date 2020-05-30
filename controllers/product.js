const Product=require("../models/product");
const formidable=require("formidable")
const fs=require("fs");
const  _ = require("lodash");


exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                // error:"product not in DB"
                error:err
            })
        }


        req.product=product;
        next();
    })
}

// createProduct

exports.createProduct=(req,res)=>{
   const form=new formidable.IncomingForm();
   form.keepExtensions=true;

   form.parse(req,(err,fields,file)=>{
     
        if(err){
            return res.status(400).json({
                error:"error in image only"
            })
        }

        // destructure the fields
        const {price,name,description,category,stock}=fields;
        
        if(
            !name||
            !description||
            !price||
            !category||
            !stock
        ){
            return res.status(400).json({
                error:'please including all fields'
            })

        }
    
        const product=new Product(fields);


        //handling file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"photo size is more than 3 MB"
                })
            }
           
            // console.log(file.photo.path);
            // console.log(file.photo.type);
            // console.log(file.photo.size);

            product.photo.data=fs.readFileSync(file.photo.path);
            product.photo.contentType=file.photo.type;

        }

    // console.log(product);

    // saving data to DB
    product.save((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"failed to save product to DB"
            })
        }

        res.json(product);

    })


   });


}

exports.getProduct=(req,res)=>{
    req.product.photo=undefined;
    
    return res.status(200).json(req.product)
}

exports.getphoto=(req,res,next)=>{
    if(req.product.photo.data){
        // console.log(req.product.photo.data)
       res.set("Content-Type",req.product.photo.contentType)
       return res.send(req.product.photo.data);
    }

    next();
}

// update controller

exports.updateProduct=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
 
    form.parse(req,(err,fields,file)=>{
      
         if(err){
             return res.status(400).json({
                 error:"error in image only"
             })
         }
        
        //updation code
         let product=req.product;
         product=_.extend(product,fields);
 
         if(file.photo){
             if(file.photo.size>3000000){
                 return res.status(400).json({
                     error:"photo size is more than 3 MB"
                 })
             }
 
             product.photo.data=fs.readFileSync(file.photo.path);
             product.photo.contentType=file.photo.type;
 
         }
 
     product.save((err,product)=>{
         if(err){
             return res.status(400).json({
                 error:"Updation of product failed"
             })
         }
 
         res.json(product);
 
     })
 
 
    });
 
}



//delete controller

exports.deleteProduct=(req,res)=>{
      let product=req.product;
      product.remove((err,deletedProduct)=>{
          if(err){
              return res.status(400).json({
                  error:"failed to delete a product"
              })
          }
         
          res.json({
              message:"deletion is success",
              deletedProduct
          })

      })
}

//listing all products

exports.getAllProducts=(req,res)=>{
     
    let limit=req.query.limit?parseInt(req.query.limit):8;
    
    let sortBy=req.query.sortBy?req.query.sortBy:"_id";

    Product.find()
     .select("-photo")
     .populate("category")
     .sort([[sortBy,"asc"]])
     .limit(limit)
     .exec((err,products)=>{
         if(err){
             return res.status(400).json({
                 error:"no product found"
             })
         }

         res.json(products);

     })
}


exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"no category found"
            })
        }

        res.json(category);

    })
}

//updating stock using bulkWrite

exports.updateStock=(req,res,next)=>{
    let myOperations=req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock:-prod.count,sold:+prod.count}}
            }
        }
    })

   product.bulkWrite(myOperations,{},(err,product)=>{
       if(err){
           return res.status(400).json({
               error:"Bulk operation failed"
           })
       }

       next();
   }) 
}

