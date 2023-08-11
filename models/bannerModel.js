const mongoose = require("mongoose")


const bannerSchema = mongoose.Schema({

    bannerImg: {
        public_Id: {
          type: String,
        },
        url: {
          type: String,
        },
      },

},{timestamps:true})

module.exports = mongoose.model("banner", bannerSchema)


