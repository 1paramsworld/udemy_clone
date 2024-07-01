import { useState } from "react";
import Jumbotron from "../../components/cards/Jumbotron";
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate,useLocation } from "react-router-dom";

export default function Login() {
  console.log(process.env.REACT_APP_API)
  const [email,setEmail]=useState("param.sanjay.shah@gmail.com");
  const [password,setPassword]=useState("27062004");
  const [auth,setAuth]=useAuth();
  const navigate=useNavigate();
  const location=useLocation();
  console.log(location)
  

  console.log(process.env.REACT_APP_API);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(`${process.env.REACT_APP_API}/login`,{email,password});
      console.log(data)
      if(data?.error){
        toast.error(data.error)
      }
      else{
        localStorage.setItem("auth",JSON.stringify(data))
        setAuth({...auth,token:data.token,user:data.user})
        toast.success("Login successful")
        navigate(location.state || `/dashboard/${data?.user?.role===1 ? 'admin':'user'}`);

      }
    } catch (error) {
        console.log(error)
        toast.error("Login failed!.Try again")
    }
  }
    return (
      <div>
        <Jumbotron title="Login"  description="Welcome to React-E-commerce"/>

        <div className="container">
           <div className="row">
              <div className="col-md-6 offset-md-3 mt-5">
                <form onSubmit={handleSubmit}>

                <input type="email" className="form-control mb-4 p-2" placeholder="Enter your email" value={email} onChange={(e)=>{
                                  setEmail(e.target.value) 
                }}  autoFocus/>

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
  
  