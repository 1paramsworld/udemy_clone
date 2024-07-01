import { useState,useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios  from "axios";
import { Select } from 'antd';
import toast from "react-hot-toast";
import { useNavigate,useParams } from "react-router-dom";


const {Option}=Select;

export default function AdminProductUpdate(){
    const [auth,setAuth]=useAuth();
    const [categories,setCategories]=useState([]);
    const [photo,setPhoto]=useState("")
    const [name,setName]=useState("")
    const [description,setDescription]=useState("")
    const [price,setPrice]=useState("")
    const [category,setCategory]=useState("");
    const [shipping,setShipping]=useState("");
    const [quantity,setQuantity]=useState("");
    const [id,setId]=useState("")
    
    const navigate=useNavigate();

    const params=useParams();
    console.log(params)

    useEffect(()=>{
        loadProduct();
    },[])

    useEffect(()=>{
        loadCategories();
    },[])

    const loadProduct=async()=>{
        try {
            const {data}=await axios.get(`/product/${params.slug}`);
            setName(data.name)
            setDescription(data.description)
            setPrice(data.price)
            setCategory(data.category._id)
            setQuantity(data.quantity)
            setShipping(data.shipping)
            setId(data._id)
        } catch (error) {
            console.log(error)
        }
    }

    const loadCategories = async () => {
        try {
          const { data } = await axios.get("/categories");
          setCategories(data);
        } catch (error) {
          console.log(error);
        }
      };

      const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const productData=new FormData();
            photo && productData.append("photo",photo)
            productData.append("name",name)
            productData.append("description",description)
            productData.append("category",category)
            productData.append("shipping",shipping)
            productData.append("quantity",quantity)
            productData.append("price",price)
            console.log(category)
            const {data}=await axios.put(`/product/${id}`,productData);
            if(data?.error){
                toast.error(data.error)
            }
            else{
                toast.success(`"${data.name}" is updated`)
                navigate("/dashboard/admin/products");
            }

        } catch (error) {
            toast.error("Product creation failed.Try again!")
        }
      }
    
      const handleDelete=async(req,res)=>{
        try {
            let answer=window.confirm("Are you sure you want to delete the product??")
            if(!answer){
                return
            }
            const {data}=await axios.delete(`/product/${id}`);
            toast.success(`${data.name} deleted`);
            navigate("/dashboard/admin/products")
        } catch (error) {
            console.log(error);
            toast.error("Delete failed!")
        }
      }
    return(
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`} description="Admin dashboard" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu/>
                    </div>
                    <div className="col-md-9">
                    <div className="p-3 mt-2 mb-2 h4 bg-light">Update Product</div>

                    {photo ?( <div className="text-center">
                        <img src={URL.createObjectURL(photo)} alt="product photo" 
                        className="img img-responsive"
                        height="200px"
                        />
                        </div>):
                        <div className="text-center">
                            <img src={`${process.env.REACT_APP_API}/product/photo/${id}?${new Date().getTime()}`}
                            alt="product photo"
                            className="img img-responsive"
                            height="200px" />
                        </div>}

                    <div className="pt-2">
                        <label className="btn btn-outline-secondary col-12 mb-3">
                            {photo? photo.name:"Upload photo"}
                        <input type="file" 
                        name="photo" 
                        accept="image/*" 
                        onChange={(e)=>setPhoto(e.target.files[0])}
                        hidden
                        ></input>

                        </label>
                    </div>

                    <input type="text" 
                    className="form-control p-2 mb-3" 
                    placeholder="Write a name" 
                    value={name} 
                    onChange={e=>setName(e.target.value)} />

                    <textarea type="text" 
                    className="form-control p-2 mb-3" 
                    placeholder="Write a description"  
                    value={description} 
                    onChange={e=>setDescription(e.target.value)} />

                    <input type="number" 
                    className="form-control p-2 mb-3" 
                    placeholder="Enter price" 
                    value={price} 
                    onChange={e=>setPrice(e.target.value)} />

                    
                    <Select 
                    bordered={false} size="large" className="form-select mb-3" placeholder="Choose category"
                    onChange={(val)=>setCategory(val)}
                    value={category}
                    >
                        {categories?.map((c)=>(
                            <Option key={c._id} value={c._id}>{c.name}</Option>
                        ))}

                    </Select>

                    <Select showSearch
                    bordered={false} size="large" className="form-select mb-3" placeholder="Choose shipping"
                    onChange={(value)=>setShipping(value)}
                    value={shipping?"yes":"No"}
                    >
                    <Option  value="0">No</Option>
                    <Option  value="1">Yes</Option>

                    </Select>


                    <input type="number" 
                    min="1"
                    className="form-control p-2 mb-3" 
                    placeholder="Enter quantity" 
                    value={quantity} 
                    onChange={e=>setQuantity(e.target.value)} />
 
                    <div className="d-flex justify-content-between">
                    <button className="btn btn-primary mb-5" onClick={handleSubmit}>Update</button>
                    <button className="btn btn-danger mb-5" onClick={handleDelete}>Delete</button>
                    </div>
                        
                    </div>
                </div>
            </div>

        </>
    )
}