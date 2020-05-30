require('dotenv').config()

const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express();

//IMPORT ROUTE
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');
const categoryRoutes=require('./routes/category');
const productRoutes=require('./routes/product');
const orderRoutes=require('./routes/order');
const stripepaymentRoutes=require('./routes/stripepayment');
const paymentBRoutes = require("./routes/paymentBRoutes");

//DATABASE CONNECTION

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
   })
   .then(()=>{
       console.log(`MONGODB CONNECTED SUCCESSFULLY...`)
   })

//middleware use

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//MAKE API

app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);
app.use('/api',stripepaymentRoutes);
app.use("/api", paymentBRoutes);

//PORT

const port =process.env.PORT||3000;

//SERVER START
app.listen(port,()=>{
    console.log(`app is up and running on the port ${port}`)
})