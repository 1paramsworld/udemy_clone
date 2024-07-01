import {Routes,Route,BrowserRouter} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "./components/nav/Menu";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategory from "./pages/admin/Category";
import AdminProduct from "./pages/admin/Product";
import AdminProductUpdate from "./pages/admin/ProductUpdate";
import AdminRoute from "./components/routes/AdminRoute";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";
import Shop from "./pages/Shop";
import Search from "./pages/Search";
import ProductView from "./pages/ProductView";
import CategoriesList from "./pages/CategoriesList";
import CategoryView from "./pages/CategoryView";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/admin/Orders";

const PageNotFound=()=>{
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="page-not-found text-center">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
          <Menu/>
          <Toaster position="top-right"/>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/shop" element={<Shop/>}></Route>
            <Route path="/categories" element={<CategoriesList/>}></Route>
            <Route path="/category/:slug" element={<CategoryView/>}></Route>
            <Route path="/cart" element={<Cart/>}></Route>
            <Route path="/search" element={<Search/>}></Route>
            <Route path="/product/:slug" element={<ProductView/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/dashboard" element={<PrivateRoute/>}>
                <Route path="user" element={<Dashboard/>}></Route>
                <Route path="user/profile" element={<UserProfile/>}></Route>
                <Route path="user/orders" element={<UserOrders/>}></Route>
            </Route>
            <Route path="/dashboard" element={<AdminRoute/>}>
                <Route path="admin" element={<AdminDashboard/>}></Route>
                <Route path="admin/category" element={<AdminCategory/>}></Route>
                <Route path="admin/product" element={<AdminProduct/>}></Route>
                <Route path="admin/products" element={<AdminProducts/>}></Route>
                <Route path="admin/product/update/:slug" element={<AdminProductUpdate/>}></Route>
                <Route path="admin/orders" element={<AdminOrders/>}></Route>

            </Route>

            <Route path="*" element={<PageNotFound/> }replace/>
        </Routes>
    </BrowserRouter>
  )
}

