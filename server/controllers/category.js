import categories from "../models/category.js";
import slugify from "slugify";
import product from "../models/product.js";

export const create = async (req, res) => {
    try {
        const { name } = req.body;
        if(!name.trim()){
            return res.json({ error: "Name is required" });

        }
        const existingCategory = await categories.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const newCategory = new categories({ name, slug: slugify(name) });
        await newCategory.save();

        return res.json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const update = async (req, res) => {
    try {
      const { name } = req.body;
      const { categoryName } = req.params;
      const category = await categories.findOneAndUpdate(
        { name: categoryName },
        {
          name,
          slug: slugify(name),
        },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  };
  
  
export const remove=async(req,res)=>{
    const findcategory= await categories.findOne({name:req.params.name});
    console.log(findcategory)
    if(!findcategory){
        return res.end("category does not exist");
        
    }
    const categorydeleted=await categories.deleteOne({name:req.params.name}).then(()=>{
        return res.end("category deleted")
    })
    
    
}
export const list=async(req,res)=>{
    const all = await categories.find({});
    res.json(all);
}
export const read=async(req,res)=>{
    const findcategory= await categories.findOne({slug:req.params.slug})
    console.log(findcategory)
    if(!findcategory){
        return res.json({error:"caanot find the category"})
    }
    else{
        return res.json(findcategory)
    }

}
 
export const productsByCategory=async(req,res)=>{
    try {
        const category=await categories.findOne({slug:req.params.slug});
        const products=await product.find({category}).populate("category");

        res.json({
            category,products
        })

    } catch (error) {
        console.log(error)
    }
}