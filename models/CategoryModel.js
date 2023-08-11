const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const categorySchema = mongoose.Schema({
    
    categoryName:{
        type:String, 
        required:true
    },
    categoryImg:{
        public_Id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
})

const category = mongoose.model("categoryAdmin", categorySchema)


const categorySubcategorySchema = mongoose.Schema({

    categoryId:{
        type:ObjectId,
        ref:"categoryAdmin"
    },
    subCategoryName:{
        type:String,
        required:true
    },
    subCategoryImg:{
        public_Id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }



})


const subCategory = mongoose.model("Subcategory",categorySubcategorySchema)


module.exports = {category, subCategory}


