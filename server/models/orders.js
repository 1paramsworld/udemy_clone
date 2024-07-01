import mongoose from "mongoose";
// import product from "./product";
const {Schema}=mongoose;
const {ObjectId}=mongoose.Schema;

const orderSchema=new Schema({
    products:[{type:ObjectId,ref:"Product"}],
    payment:{},
    buyer:{type:ObjectId,ref:"User"},
    status:{type:String,
        default:"Not processed",
        enum:[
        "Not processed","Processing","Shipped","Delieverd","Cancelled"
    ]}
    },{timestamps:true}
)
export default mongoose.model("Order",orderSchema);

