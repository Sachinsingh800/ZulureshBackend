const { default: axios } = require("axios");
const Location = require("../models/userLocation");
const AddLocation = require("../models/adminLocation");
const TimeSlot = require("../models/timeSlot");
const moment = require("moment");

/////////////////////////////////////// location added by admin /////////////////////////////////////////



exports.adminPincode = async (req, res) => {
  try{
  let data = req.body;

  let { pincode } = data;

const checkPincode = await AddLocation.findOne({pincode:pincode})
if(checkPincode){
  return  res.status(200).send({status:false , message:"This Area Pincode is already exist"})
}

  const addedLocation = await AddLocation.create(data);
  res.status(201).send({ status: true, data: addedLocation });
}catch(err){
  res.status(500).json({status:false , messsage:err.message})
}
};

/////////////////////// get All pincode by admin ///////////////////////

exports.allPincode = async (req, res) => {
  try{
const allPincode = await AddLocation.find()
if(allPincode.length==0){
  return  res.status(200).send({status:false , message:"This Area Pincode not found"})
}
  res.status(201).send({ status: true, data: allPincode });
}catch(err){
  res.status(500).json({status:false , messsage:err.message})
}
};


//////////////////// delete pincode ///////////////////////////////////


exports.deletePincode = async (req, res) => {
  try{
    let id = req.params.id
const pincode = await AddLocation.findByIdAndDelete(id)
if(!pincode){
  return  res.status(404).send({status:false , message:"This Area Pincode not found"})
}
  res.status(201).send({ status: true, message:"pincode deleted successfully" });
}catch(err){
  res.status(500).json({status:false , messsage:err.message})
}
};



//////////////// (GPS) by current location ====== location data (======= city , state pincode =======);

exports.gpsLocation = async (req, res) => {
  let data = req.body;

  let { state, pincode, city } = data;

  try {
    const checkPincode = await AddLocation.findOne({ pincode: pincode });
    if (!checkPincode) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Oops, like we don't serve your area !",
        });
    }
    const gpsLocationData = await Location.create(data);

    res.status(201).send({ status: true, data: gpsLocationData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.messsage });
  }
};

//////////////////////////////// taking location info through pin code ///////////////////////////////

exports.location = async (req, res) => {
  let data = req.body;

  let { state, pincode, city } = data;

  try {
    const checkPincode = await AddLocation.findOne({ pincode: pincode });
    if (!checkPincode) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Oops, like we don't serve your area !",
        });
    }

    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const { PostOffice } = response.data[0];
    const { District, State } = PostOffice[0];

    state = data.state = State;
    city = data.city = District;

    const locationData = await Location.create(data);

    res.status(201).send({ status: true, data: locationData });
  } catch (error) {
    res.status(500).send({ error: "Unable to retrieve user data" });
  }
};

//////////////////////////// delivery time Slot added by admin //////////////////////////////////////////

exports.timeSlot = async (req, res) => {
  try {
    const { day, timeRange } = req.body;
    const [startTime, endTime] = timeRange.split(" to ");

    const formattedDate = moment(day, "dddd (DD MMM)").format("dddd (DD MMM)");

    if (!moment(day, "dddd (DD MMM)").isValid()) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }
    if (
      !moment(startTime, "h:mmA").isValid() ||
      !moment(endTime, "h:mmA").isValid()
    ) {
      return res.status(400).json({
        message: "Invalid time format",
      });
    }

    const newTimeSlot = new TimeSlot({
      day: formattedDate,
      startTime,
      endTime,
    });
    console.log(newTimeSlot);
    const tt = await TimeSlot.create(newTimeSlot);

    res.status(201).json({
      message: "Time slot added successfully",
      timeSlot: tt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add time slot",
      error: error.message,
    });
  }
};


///////////////////////////////////////////////////// get All Time slot for admin ////////////////////////////

exports.allTimeSlotWithId = async (req , res)=>{

  const allSlot = await TimeSlot.find()

  if(allSlot.length ==0){
    return res.status(400).send({status:false , message:"there is no time slot availble"})
  }

  res.status(200).send({status:true , timeSlots:allSlot})
}

////////////////////////////// get allTimeSlot ////////
// rough delete krna h 
exports.getTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find();

    // Format each time slot
    const formattedTimeSlots = timeSlots.map((slot) => {
      const formattedDate = moment(slot.day, "dddd (DD MMM)").format(
        "dddd (DD MMM)"
      );
      return `${formattedDate} ${slot.startTime} - ${slot.endTime}`;
    });

    res.status(200).json({
      message: "Time slots retrieved successfully",
      timeSlots: formattedTimeSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve time slots",
      error: error.message,
    });
  }
};


///////////////////////////////////////////////// update timeslot admin  /////////////////////////////////////

exports.updateTimeSlot = async (req, res) => {
  try {
    const slotId = req.params.slotId; 
    const { day, timeRange } = req.body;
    const [startTime, endTime] = timeRange.split(" to ");

    const formattedDate = moment(day, "dddd (DD MMM)").format("dddd (DD MMM)");

    if (!moment(day, "dddd (DD MMM)").isValid()) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (
      !moment(startTime, "h:mmA").isValid() ||
      !moment(endTime, "h:mmA").isValid()
    ) {
      return res.status(400).json({
        message: "Invalid time format",
      });
    }

 
    const timeSlot = await TimeSlot.findByIdAndUpdate(
      { _id: slotId },
      { $set: { day: formattedDate, startTime: startTime, endTime: endTime } },
      { new: true }
    );

    if (!timeSlot) {
      return res.status(404).json({
        message: "Time slot not found",
      });
    }

    res.status(200).json({
      message: "Time slot updated successfully",
      timeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update time slot",
      error: error.message,
    });
  }
};

////////////////////////////////////// delete all time slot admin ////////////////////////////////////////////

exports.deleteAllTimeSlots = async (req, res) => {
  try {
    await TimeSlot.deleteMany();

    res.status(200).json({
      message: 'All time slots deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete all time slots',
      error: error.message,
    });
  }
};

///////////////////////////////////// delete single timeSlot /////////////////////////////////////////////////

exports.deleteSingleTimeSlot = async (req, res) => {
  try {
    const slotId = req.params.slotId; 

    const timeSlot = await TimeSlot.findByIdAndDelete({_id:slotId});

    if (!timeSlot) {
      return res.status(404).json({
        message: 'Time slot not found',
      });
    }


    res.status(200).json({
      message: 'Time slot deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to delete time slot',
      error: error.message,
    });
  }
};
  






