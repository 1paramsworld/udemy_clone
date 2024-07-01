
import { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Loadingimage from "../../images/loading.gif";

export default function Loading({path="login"}) {
  // State
  const [count, setCount] = useState(3);
  // Hooks    
  const navigate = useNavigate();
  const location=useLocation();
  console.log(location);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);

    count===0 && navigate(`/${path}`,{
      state:location.pathname,
    })
    return () => {
      clearInterval(interval);
    };
  }, [count]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <img src={Loadingimage} alt="Loading" style={{ width: "400px" }} />
    </div>
  );
}
