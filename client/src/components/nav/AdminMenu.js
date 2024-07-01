import {NavLink} from "react-router-dom";

export default function AdminMenu(){
    return (
        <>
        <div className="p-3 mt-2 mb-2 h4 bg-light">Admin links</div>

        <ul className="list-group list-unstyled">
            <li><NavLink className="list-group-item" to="/dashboard/admin/category">Create Category</NavLink></li>
            <li><NavLink className="list-group-item" to="/dashboard/admin/product">Create product</NavLink></li>
            <li><NavLink className="list-group-item" to="/dashboard/admin/products">Products</NavLink></li>
            <li><NavLink className="list-group-item" to="/dashboard/admin/products">Manage orders</NavLink></li>

        </ul>
        </>
    )
}