import express from "express";

const router=express.Router();

import { json1 } from "../controllers/auth.js";
import { json2 } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import { requireLogin,isAdmin } from "../middlewares/auth.js";
import { secret , updateProfile, getOrders , allOrders} from "../controllers/auth.js";

router.post("/register",json1)
router.post("/login",login);
router.get("/authcheck",requireLogin, (req,res)=>{
    res.json({ok:true})
});
router.get("/admin-check",requireLogin,isAdmin, (req,res)=>{
    res.json({ok:true})
})
router.put("/profile",requireLogin,updateProfile)

router.get("/secret",requireLogin,isAdmin, secret)
router.get("/orders",requireLogin,getOrders);
router.get("/all-orders",requireLogin,isAdmin,allOrders)

export default router;