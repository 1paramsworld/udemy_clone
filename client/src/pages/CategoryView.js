import Jumbotron from "../components/cards/Jumbotron";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import ProductCard from "../components/cards/ProductCard";

export default function CategoryView(){
    const [products,setProducts]=useState([]);
    const navigate=useNavigate();
    const params=useParams();
    const [category,setCategory]=useState({});

    useEffect(()=>{
        if(params?.slug) loadProductsByCategory();
    },[params?.slug])

    async function loadProductsByCategory(){
        try {
            const {data}=await axios.get(`/products-by-category/${params.slug}`);
            setCategory(data.category);
            setProducts(data.products)

        } catch (error) {
            console.log(error)
        }
    }

    console.log(params)
    return(
        <>
        <Jumbotron title={category?.name} description={`${products?.length} products are left in "${category.name}"`} /> 
        <div className="container-fluid">
            <div className="row">
                <div className="row mt-3">
                    {products?.map(p=><ProductCard key={p._id } p={p}/>)}
                </div>
            </div>
        </div>
        </>
    )
}