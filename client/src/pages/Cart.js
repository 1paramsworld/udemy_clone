import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import Jumbotron from "../components/cards/Jumbotron";
import UserCardSidebar from "../components/cards/UserCardSidebar";
import { useNavigate } from "react-router-dom";
import ProductCardHorizontal from "../components/cards/ProductCardHorizontal";
export default function Cart() {
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();

    const navigate=useNavigate();
    const removeFromCart = async (productId) => {
        let myCart = [...cart];
        let index = myCart.findIndex((item) => item._id === productId);
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart",JSON.stringify(myCart))
    };


    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.token && auth?.user?.name}`}
                description={
                    cart?.length 
                        ? `You have ${cart?.length} items in the cart.${auth?.token ? "" : " Please login to checkout"}`
                        : "Your cart is empty"
                }
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            {cart?.length ? (
                                "My cart"
                            ) : (
                                <div className="text-center">
                                    <button className="btn btn-primary" onClick={() => navigate("/")}>
                                        Continue shopping
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {cart?.length && (
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                {cart?.map((p,index) => (
                                    <ProductCardHorizontal key={index}  p={p}/>    
                                ))}
                            </div>
                        </div>
                        <UserCardSidebar /> 
                    </div>
                </div>
            )}
        </>
    );
}

