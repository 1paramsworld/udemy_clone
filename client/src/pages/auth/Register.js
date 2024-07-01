import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  console.log(process.env.REACT_APP_API)
  const [name,setName]=useState("ryan");
  const [email,setEmail]=useState("ryan@gmail.com");
  const [password,setPassword]=useState("rrrrrrrr");
  const [auth,setAuth]=useAuth();
  const navigate=useNavigate();

  console.log(process.env.REACT_APP_API);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(`${process.env.REACT_APP_API}/register`,{name,email,password});
      console.log(data)
      if(data?.error){
        toast.error(data.error)
      }
      else{
        localStorage.setItem("auth",JSON.stringify(data))
        toast.success("Registration successful");
        navigate("/dashboard/user");
      }
    } catch (error) {
        console.log(error)
    }
  }
    return (
      <div>
        <Jumbotron title="Register"  description="Welcome to React-E-commerce"/>

        <div className="container">
           <div className="row">
              <div className="col-md-6 offset-md-3 mt-5">
                <form onSubmit={handleSubmit}>
                <input type="text" className="form-control mb-4 p-2" placeholder="Enter your name" value={name} onChange={(e)=>{
                  setName(e.target.value) 
                }} autoFocus/>

                <input type="email" className="form-control mb-4 p-2" placeholder="Enter your email" value={email} onChange={(e)=>{
                  setEmail(e.target.value) 
                }} />

                <input type="password" className="form-control mb-4 p-2" placeholder="Enter your password" value={password} onChange={(e)=>{
                  setPassword(e.target.value) 
                }} autoFocus/>

                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>  
                </form>              
              </div>
           </div>
        </div>
      </div>
      
    );
  }
  
