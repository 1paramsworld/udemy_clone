import express from "express";
const Router=express.Router();
import { requireLogin,isAdmin } from "../middlewares/auth.js";
import {create,list,remove,update,read,productsByCategory} from "../controllers/category.js";

Router.post("/category",requireLogin,isAdmin,create);
Router.put("/category/:categoryName", requireLogin, isAdmin, update);

Router.delete("/category/:name",requireLogin,isAdmin,remove);
Router.get("/category/:slug",read);
Router.get("/categories",list);
Router.get("/products-by-category/:slug",productsByCategory)

export default Router;