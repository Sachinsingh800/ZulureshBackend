const BannerModel = require("../models/bannerModel")

const cloudinary = require("cloudinary")

// need to check

exports.createBanner = async (req, res) => {
    try {
      let data = req.body

      if (!req.files || !req.files.bannerImg) {
        return res.status(400).json({ status: false, message: "Upload banner image" });
      }
  
      const bannerImg = req.files.bannerImg;
  
      const result = await cloudinary.uploader.upload(bannerImg.tempFilePath, {
        resource_type: 'bannerImg',
        folder: 'bannerImgZulu',
      });

        data.bannerImg= {
          public_Id: result.public_id,
          url: result.secure_url, 
        }

        const newBanner = await BannerModel.create(data);
  
        return res.status(201).json({ status: true, message: "Banner created successfully", data:newBanner});
      }
    catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  };



exports.getAllBanner = async (req, res)=>{
    try{

       const allBanner = await BannerModel.find() 

res.status(200).json({status:true , data:allBanner, count:allBanner.length})

    }catch(err){
        res.status(500).json({status:false , message:err.message})
    }
}




exports.deleteSingleBanner = async (req, res) => {
    try {
      const bannerId = req.params.bannerId; 

    

      const banner = await BannerModel.findById(bannerId);
  
      if (!banner) {
        return res.status(404).json({ status: false, message: "Banner not found" });
      }
  

      const publicId = banner.bannerImg.public_Id;

      cloudinary.v2.uploader.destroy(publicId, async (error, result) => {
        if (error || result.result !== "ok") {
          return res.status(500).json({ status: false, message: "Error deleting banner image from Cloudinary" });
        }
  
        await BannerModel.findByIdAndDelete(bannerId);
  
        return res.status(200).json({ status: true, message: "Banner deleted successfully" });
      });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  };
