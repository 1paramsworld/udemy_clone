import slugify from "slugify";
import Product from "../models/product.js";
import fs from "fs";
import { error } from "console";
import braintree from "braintree";
import Order from "../models/orders.js";
import { ok } from "assert";
import nodemailer from "nodemailer";

const gateway=new braintree.BraintreeGateway({
  environment:braintree.Environment.Sandbox,
  merchantId:process.env.BRAINTREE_MERCHENT_ID,
  publicKey:process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY,
})

export const create = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name.trim():
        return res.json({ error: "Name is required" });
      case !description.trim():
        return res.json({ error: "Description is required" });
      case !price.trim():
        return res.json({ error: "Price is required" });
      case !category.trim():
        return res.json({ error: "Category is required" });
      case !quantity.trim():
        return res.json({ error: "Quantity is required" });
      case !shipping.trim():
        return res.json({ error: "Shipping is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export const photo=async(req,res)=>{
  try {
    const product=await Product.findById(req.params.productId);
    if(product.photo.data){
      res.set("Content-Type",product.photo.contentType);
      return res.send(product.photo.data)
    }
  } catch (error) {
      console.log(error)
  }
}

export const list=async(req,res)=>{
    try {
        const products=await Product.find({}).select("-photo").limit(12).sort({createAt:-1});
        return await res.json(products)
    } catch (error) {
        console.log(error.message)
    }
}


export const read=async(req,res)=>{
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.json(product);
  } catch (err) {
    console.log(err);
  }

}

export const remove=async(req,res)=>{
    try {
        const requiredslug=await Product.findOne({_id:req.params.productId});
        if(!requiredslug){
            return res.end("category does not exist");
            
        }
        const productdeleted=await Product.deleteOne({_id:req.params.productId}).then(()=>{
            return res.end("Product deleted")
        })
    } catch (error) {
        return res.end({error:error.message})
    }
}


export const update = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } =req.fields;
      const { photo } = req.files;
  
      switch (true) {
        case !name.trim():
          res.json({ error: "Name is required" });
        case !description.trim():
          res.json({ error: "Description is required" });
        case !price.trim():
          res.json({ error: "Price is required" });
        case !category.trim():
          res.json({ error: "Category is required" });
        case !quantity.trim():
          res.json({ error: "Quantity is required" });
        case !shipping.trim():
          res.json({ error: "Shipping is required" });
        case photo && photo.size > 1000000:
          res.json({ error: "Image should be less than 1mb in size" });
      }
  
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        {
          ...req.fields,
          slug: slugify(name),
        },
        { new: true }
      );
  
      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }
  
      await product.save();
      res.json(product);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    }
  };
  
  export const filteredproducts=async(req,res)=>{
    try {
      const  {checked,radio}=req.body;
      let args={};
      if(checked.length>0) args.category=checked;
      if(radio.length) args.price={$gte:radio[0],$lte:radio[1]};
      console.log(args)

      const products=await Product.find(args);
      console.log(products.length)
      res.json(products)
    } catch (error) {
      console.log(error)
    }
  }

  export const productsCount=async(req,res)=>{
    try {
      const total=await Product.find({}).estimatedDocumentCount();
      res.json(total)
    } catch (error) {
      console.log(error)
    }
  }
  export const listProducts=async(req,res)=>{
    try {
      const perPage=3;
      const page=req.params.page?req.params.page:1;
      const products=await Product.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});

      res.json(products)
    } catch (error) {
      console.log(error)
    }
  }

  export const productsSearch=async(req,res)=>{
    try {
      const {keyword}=req.params;
      const results=await Product.find({
        $or:[
          {name:{$regex:keyword,$options:"i"}},
          {desc:{$regex:keyword,$options:"i"}}
        ]
      }).select("-photo");

      res.json(results)
    } catch (error) {
      console.log(error)
    }
  }

  export const relatedProducts=async(req,res)=>{
    try {
      const {productId,categoryId}=req.params;
      const related=await Product.find({
        category:categoryId,
        _id:{
          $ne:productId
        }
      }).select("-photo").populate("category").limit(3);

      res.json(related)
    } catch (error) {
      console.log(error)
    }
  }

  export const getToken =async(req,res)=>{
    try {
      gateway.clientToken.generate({},function(err,response){
        if(err){
          res.status(500).send(err);

        }
        else{
          res.send(response)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  export const processPayment =async(req,res)=>{
    try {
      const {nonce,cart}=req.body;
      let total=0;

      cart.map((i)=>{
        total+=i.price
      })
      let newTransaction=gateway.transaction.sale(
        {
          amount:total,
          paymentMethodNonce:nonce,
          options:{
            submitForSettlement:true
          }
        }
      ,function (error,result){
        if(result){
          const order=new Order({
            products:cart,
            payment:result,
            buyer:req.user._id 
          }).save();

          decreamentQuantity(cart);
          res.json({ok:true})
        }else{
          res.status(500).send(error)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const decreamentQuantity=async(cart)=>{
    try {
      const bulkOps=cart.map((item)=>{
        return {
          updateOne:{
            filter:{_id:item._id},
            update:{$inc:{
              quantity:-0,sold:+1
            }}
          }
        }
      });
      const updated=await Product.bulkWrite(bulkOps,{});
      console.log(updated)
    } catch (error) {
      console.log(error)
    }
  }

  export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate("buyer", "email name");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        async function sendEmail() {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: order.buyer.email,
                subject: 'Order Status Update',
                html: `
                <h1>Hello ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
                <p>Visit our website for more details.</p>
                `,
            };

            try {
                let info = await transporter.sendMail(mailOptions);
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            } catch (error) {
                console.log(error);
            }
        }

        await sendEmail();
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }
};
