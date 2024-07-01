import express from "express";
import formidable from "express-formidable";

const Router=express.Router();

import { requireLogin,isAdmin } from "../middlewares/auth.js";
import {create,list,read,remove,update,photo,filteredproducts,listProducts,productsCount,productsSearch,relatedProducts,getToken
    ,processPayment,orderStatus
} from "../controllers/product.js";

Router.post("/product",requireLogin,isAdmin,formidable(),create);
Router.get("/products",list);
Router.get("/product/:slug",read)
Router.get("/product/photo/:productId",photo)
Router.delete("/product/:productId",requireLogin,isAdmin,remove)
Router.put("/product/:productId",requireLogin,isAdmin,formidable(),update)
Router.post("/filteredproducts",filteredproducts)
Router.get("/products-count",productsCount);
Router.get("/list-products/:page",listProducts);
Router.get("/products/search/:keyword",productsSearch)
Router.get("/related-products/:productId/:categoryId",relatedProducts)
Router.get("/braintree/token",getToken);
Router.post("/braintree/payment",requireLogin,processPayment);
Router.put("/order-status/:orderId",requireLogin,isAdmin,orderStatus)

export default Router;