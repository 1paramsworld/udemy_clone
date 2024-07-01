
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import AdminMenu from "../../components/nav/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/forms/Category";
import { Modal } from "antd";

export default function AdminCategory() {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null); 
  const [updatingName, setUpdatingName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/categories");
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = await axios.post("/category", { name });
      console.log(data.data.name);
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCategories();
        setName("");
        toast.success(`${data.data.name} created`);
      }
    } catch (error) {
      console.log(error);
      toast.error("create category failed. Try again!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        console.log(selected)
      const { data } = await axios.put(`/category/${selected.name}`, {
        name: updatingName,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${data.name}"  updated`);
        setSelected(null);
        setUpdatingName("");
        loadCategories(); 
      }
    } catch (error) {
      console.log(error);
      toast.error("Category update failed. Try again!");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`/category/${selected.name}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`"${selected.name}"  deleted`);
        setSelected(null);
        loadCategories(); 
        setVisible(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Category update failed. Try again!");
    }
  };



  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.user?.name}`}
        description="Admin dashboard"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>
            <CategoryForm
              value={name}
              setValue={setName}
              handleSubmit={handleSubmit}
            />
            <hr />
            <div className="col">
              {categories?.map((c) => (
                <button
                  key={c._id}
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setVisible(true);
                    setSelected(c); 
                    setUpdatingName(c.name); 
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <Modal
              visible={visible}
              onOk={() => setVisible(false)}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <CategoryForm
                value={updatingName}
                setValue={setUpdatingName}
                handleSubmit={handleUpdate}
                buttonText="Update"
                handleDelete={handleDelete}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
