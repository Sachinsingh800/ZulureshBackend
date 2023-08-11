const mongoose = require("mongoose")

const timeSlotSchema = new mongoose.Schema({

    day: String,
    startTime: String,
    endTime: String,
})


module.exports = mongoose.model("timeSlot", timeSlotSchema)
