const stripe=require('stripe')('sk_test_DSNrl2nRy0a4VOas40vh7DAz00DRLcS6yP');
const uuid=require('uuid/v4');

exports.makestripepayment=(req,res)=>{
   const {token,products}=req.body;
   console.log('products : ',products);

   let amount=0;
   products.map((p)=>{
       amount+=p.price;
   })

   const idempotencyKey=uuid();

   return stripe.customers.create({
       email:token.email,
       source:token.id
   })
   .then(customer=>{
       stripe.charges.create({
           amount:amount*100,
           currency:'usd',
           customer:customer.id,
           receipt_email:token.email,
           description:'this is a test account',
           shipping:{
               line1:token.card.address_line1,
               line2:token.card.address_line2,
               city:token.card.address_city,
               country:token.card.address_country,
               postal_code:token.card.address_zip
           }

       },{idempotencyKey})
       .then(result=>res.status(200).json(result))
       .catch(err=>console.log(err))
   })
}