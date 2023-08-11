const { category, subCategory } = require("../models/CategoryModel");
const cloudinary = require("cloudinary").v2;

////////////////////////// create Category by Admin ///////////////////////

exports.createCategory = async (req, res) => {
  try {
    let { categoryName } = req.body;

    if (!req.files || !req.files.categoryImg) {
      return res.status(400).json({status:false, message: "Please provide categoryImg file" });
    }

    const categoryImg = req.files.categoryImg;

    const uploadedImage = await cloudinary.uploader.upload(
      categoryImg.tempFilePath,
      {
        folder: "categories",
      }
    );

    const newCategory = new category({
      categoryName,
      categoryImg: {
        public_Id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
    });

    // Save category to the database
    let catData = await newCategory.save();

    res.status(200).json({
      ststus: true,
      message: "Category created successfully",
      data: catData,
    });
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};
////////////////////////// update Category ///////////////////////////////
exports.updateCategory = async (req, res) => {
  try {
    let catId = req.params.catId;
    let { categoryName } = req.body;

    // Find category by ID
    const existingCategory = await category.findById(catId);

    if (!existingCategory) {
      return res.status(404).json({status:false, message: "Category not found" });
    }

    // Delete previous image from Cloudinary if new image is uploaded
    if (req.files && req.files.categoryImg) {
      await cloudinary.uploader.destroy(existingCategory.categoryImg.public_Id);

      const categoryImg = req.files.categoryImg;

      // Upload new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(
        categoryImg.tempFilePath,
        {
          folder: "categories",
        }
      );

      existingCategory.categoryImg = {
        public_Id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    // Update category name
    existingCategory.categoryName =
      categoryName || existingCategory.categoryName;

    // Save updated category to the database
    let updatedCat = await existingCategory.save();

    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCat,
    });
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};
/////////////////////// get All Category //////////////////////////////////
exports.getAllCategory = async (req, res) => {
  try {
    let allCat = await category.find();

    res.status(200).json({ status: true, data: allCat });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//////////////////////////// get Single Category /////////////////////////


exports.getSingleCategory = async (req, res) => {
  try {
    let catId = req.params.catId;
    let singleCat = await category.findById(catId);
    if (!singleCat) {
        return res.status(404).json({  status: false, message: "Category not found" });
      }
    res.status(200).json({ status: true, data: singleCat });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

/////////////////////////// delete selected category //////////////////////
// have to improve if any category is going to remove then all the subcaategory of this category should be deleted ...
exports.deleteSingleCategory = async (req, res) => {
    try {
      let catId = req.params.catId;
      const categoryToDelete = await category.findById(catId);
  
      if (!categoryToDelete) {
        return res.status(404).json({  status: false, message:"Category not found" });
      }
  
     
      await cloudinary.uploader.destroy(categoryToDelete.categoryImg.public_Id);
  
    
      await category.findByIdAndRemove(catId);
  
      res.status(200).json({
        status: true,
        message: "Category deleted successfully",
        data: categoryToDelete,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  

////////////////////////// create Sub Category by Admin ///////////////////////

exports.createSubCategory = async (req, res) => {
    try {
      let catId = req.params.catId;
      let { subCategoryName } = req.body;
  
     
      if (!req.files || !req.files.subCategoryImg) {
        return res.status(400).json({ status: false, message: "Please provide subCategoryImg file" });
      }
  
      const subCategoryImg = req.files.subCategoryImg;
  
    
      const uploadedImage = await cloudinary.uploader.upload(
        subCategoryImg.tempFilePath,
        {
          folder: "subCategories",
        }
      );
  

      const newSubCategory = new subCategory({
        categoryId: catId,
        subCategoryName,
        subCategoryImg: {
          public_Id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        },
      });
  

      let subCategoryData = await newSubCategory.save();
  
      res.status(200).json({
        status: true,
        message: "Subcategory created successfully",
        data: subCategoryData,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  ////////////////////////// update Sub Category ///////////////////////////////
  
  exports.updateSubCategory = async (req, res) => {
    try {
      let catId = req.params.catId;
      let subCatId = req.params.subCatId;
      let { subCategoryName } = req.body;
      const existingSubCategory = await subCategory.findById(subCatId);
      if (!existingSubCategory) {
        return res.status(404).json({ status: false, message: "Subcategory not found" });
      }
      if (req.files && req.files.subCategoryImg) {
        await cloudinary.uploader.destroy(existingSubCategory.subCategoryImg.public_Id);
        const subCategoryImg = req.files.subCategoryImg;
        const uploadedImage = await cloudinary.uploader.upload(
          subCategoryImg.tempFilePath,
          {
            folder: "subCategories",
          }
        );
  
        existingSubCategory.subCategoryImg = {
          public_Id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      }
  
     
      existingSubCategory.subCategoryName =
        subCategoryName || existingSubCategory.subCategoryName;
  
      let updatedSubCat = await existingSubCategory.save();
  
      res.status(200).json({
        status: true,
        message: "Subcategory updated successfully",
        data: updatedSubCat,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  ///////////////////////// get All Sub Categories ////////////////////////////////
  
  exports.getAllSubCategories = async (req, res) => {
    try {
      let catId = req.params.catId;
      let allSubCategories = await subCategory.find({ categoryId: catId });
  
      res.status(200).json({ status: true, data: allSubCategories });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
   
  ////////////////////////// get Single Sub Category //////////////////////////////
  
  exports.getSingleSubCategory = async (req, res) => {
    try {
      let subCatId = req.params.subCatId;
      let singleSubCategory = await subCategory.findById(subCatId);
  
      if (!singleSubCategory) {
        return res.status(404).json({ status: false, message: "Subcategory not found" });
      }
  
      res.status(200).json({ status: true, data: singleSubCategory });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  
  ///////////////////////// delete All Sub Categories of a Category ////////////////////
  


exports.deleteAllSubCategories = async (req, res) => {
    try {
      let catId = req.params.catId;
  
   
      const subCategories = await subCategory.find({ categoryId: catId });
  
     
      for (let i = 0; i < subCategories.length; i++) {
        await cloudinary.uploader.destroy(subCategories[i].subCategoryImg.public_Id);
        await subCategory.findByIdAndRemove(subCategories[i]._id);
      }
  
      res.status(200).json({
        status: true,
        message: "All subcategories of the category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  ////////////////////////// delete Single Sub Category /////////////////////////////
  
  exports.deleteSingleSubCategory = async (req, res) => {
    try {
      let subCatId = req.params.subCatId;
  
    
      const subCategoryToDelete = await subCategory.findById(subCatId);
  
      if (!subCategoryToDelete) {
        return res.status(404).json({ status: false, message: "Subcategory not found" });
      }
  
      
      await cloudinary.uploader.destroy(subCategoryToDelete.subCategoryImg.public_Id);
  
    
      await subCategory.findByIdAndRemove(subCatId);
  
      res.status(200).json({
        status: true,
        message: "Subcategory deleted successfully",
        data: subCategoryToDelete,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  