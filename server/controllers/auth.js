import User from "../models/user.js";
import categories from "../models/category.js";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import user from "../models/user.js";
import Order from "../models/orders.js";


dotenv.config();

export const json1 = async (req, res) => {
    try {
        console.log(process.env.JWT_SECRET);
        const { name, email, password } = req.body;
        console.log(name);

        if (!name.trim()) {
            return res.json({ error: "Name is required" });
        }
        if (!email) {
            return res.json({ error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Invalid password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ error: "The email already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new User({ name, email, password: hashedPassword }).save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({
            user: {
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const {  email, password } = req.body;

        if (!email) {
            return res.json({ error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Invalid password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "The user does not exists" });
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.json({error:"incorrect password"})
        }


        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({
            user: {
                name: user.name,
                email: user.email,
                role:user.role,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const updateProfile=async(req,res)=>{
    try {
        const {name,password,address}=req.body;
        const user=await User.findById(req.user._id);
        if(password && password.length<6){
            return res.json({error:"Password is required & should be minimum 6 letters"})
        }

        //hash the password
        const hashedPassword=password?await hashPassword(password):undefined;

        const updated=await User.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:hashedPassword || user.password,
            address:address || user.address
        },{new:true});

        updated.password=undefined;
        res.json(updated)
    } catch (error) {
        console.log(error)
    }
}

export const json2 = async (req, res) => {
    res.end("hey2");
};

export const secret=(req,res)=>{
    res.end("you can access this page now")
}

export const getOrders=async(req,res)=>{
    try {
        const orders=await Order.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders)
    } catch (error) {
        console.log(error)
    }
}

export const allOrders=async(req,res)=>{
    try {
        const orders=await Order.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:-1});
        res.json(orders)
    } catch (error) {
        console.log(error)
    }
}