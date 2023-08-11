const UserModel = require("../models/userModel");
const addressInfo = require("../models/addressInfo");
const CustomerDetails = require("../models/userDetails");

// create user dummy Profile

exports.createCustomerData = async (req, res) => {
  try {
    let userId = req.user._id;
    let data = req.body;

    let { customerId, name, customerNumber ,userObjectId} = data;

    let userNumber = await UserModel.findById(userId);

    if (!userNumber) {
      return res
        .status(400)
        .json({ status: false, message: "Verify your number" });
    }

//////////////////////////////////////////////


/* 
    let userAddress = await addressInfo.findOne({ userId: userId });

    if (!userAddress) {
      return res
        .status(400)
        .json({ status: false, message: "Provide your address" });
    }

    let joinedDate = new Date(userNumber.createdAt);
    let formattedJoinedDate = joinedDate.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

const custId = await CustomerDetails.find()
 */


//////////////////////////////

let joinedDate = new Date(userNumber.createdAt);
let formattedJoinedDate = joinedDate.toLocaleString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

     userObjectId = data.userObjectId = req.user._id
    customerId = data.customerId = req.user.userId;
    customerNumber = data.customerNumber = userNumber.number;

 const createdCustomerDetails = await CustomerDetails.create({
      customerId,
      joinedDate: formattedJoinedDate,
      customerNumber,
      userObjectId
    });

    res.status(201).json({ status: true, data: createdCustomerDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};

// update details ..... default

exports.updateCustomer = async (req, res) => {
  try {
    let addressId = req.params.addressId;
    let userId = req.user._id;
    let data = req.body;

    let { customerId, name, customerNumber } = data;

    let userNumber = await UserModel.findById(userId);

    if (!userNumber) {
      return res
        .status(400)
        .json({ status: false, message: "Verify your number" });
    }

    let userAddress = await addressInfo.findOne({
      _id: addressId,
      userId: userId,
    });

    if (!userAddress) {
      return res
        .status(400)
        .json({ status: false, message: "Provide your address" });
    }

    
    customerNumber = userNumber.number;

    const updatedCustomerDetails = await CustomerDetails.findOneAndUpdate(
      { userObjectId: req.user._id },
      {
        customerId,
        name: userAddress.name,
        address: {
          pincode: userAddress.pinCode,
          locality: userAddress.locality,
        },
        customerNumber,
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: updatedCustomerDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};

//////// get user profile by user 
/* 
exports.getProfile = async (req, res) => {
  try {
    let userId = req.user._id;

    const userProfile = await CustomerDetails.findOne({userObjectId:userId});
console.log(userProfile)
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ status: true, data: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};
 */

// working get profile for user 

exports.getProfile = async (req, res) => {
  try {
    let userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ status: false, message: "Verify your number" });
    }
   
    let userData = await UserModel.findById(userId);

    if (!userData) {
      return res.status(404).json({ status: false, message: "User data not found" });
    }
    const formattedCreatedAt = userData.createdAt.toISOString().substr(0, 10);

    let userProfile = {
      number: req.user.number,
      customerId: userId,
      createdAt: formattedCreatedAt,
      address: {}
    };

    let userAddress = await addressInfo.findOne({ userId: userId, setAsDefault: true });

    if (userAddress) {
      userProfile.address.pincode = userAddress.pinCode;
      userProfile.address.locality = userAddress.locality;
      userProfile.address.name = userAddress.name;
    }

    res.status(200).json({ status: true, data: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};




// get all profiles (admin )

exports.getAllUserProfiles = async (req, res) => {
  try {
    const allUserProfiles = await CustomerDetails.find();
    let count = allUserProfiles.length;
    res.status(200).json({ status: true, data: allUserProfiles, count: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};


// get single profile (admin)

exports.getSingleUserProfile = async (req, res) => {
    try {
      let profileId = req.params.profileId;
  
      const userProfile = await CustomerDetails.findById(profileId);
  
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
  
      res.status(200).json({ status: true, data: userProfile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: error.message });
    }
  };
  

// update customer profile( admin )

exports.updateUserProfileAdmin = async (req, res) => {
  try {
    let profileId = req.params.profileId;
    let data = req.body;
    const userProfile = await CustomerDetails.findOneAndUpdate(
      { _id: profileId },
      { ...data },
      { new: true }
    );

    if (!userProfile) {
      return res.status(404).json({status:false , message: "User profile not found" });
    }

    res.status(200).json({ status: true, data: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};


// export data into excel



const XLSX = require('xlsx');
const XLSXStyle = require('xlsx-style');

exports.exportUserProfilesToExcel = async (req, res) => {
  try {
    const allUserProfiles = await CustomerDetails.find();

    // Convert user profiles data to the desired format for Excel
    const excelData = allUserProfiles.map((profile, index) => ({
      'Serial No.': index + 1,
      'Customer ID': profile.customerId.toString(),
      'Name': profile.name,
      'Address': `${profile.address.locality}, ${profile.address.pincode}`,
      'Customer Number': profile.customerNumber,
      'Joined Date': profile.joinedDate,
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Define the style for bold cells
    const boldCellStyle = { font: { bold: true } };

    // Apply bold style to specific columns
    const boldColumns = ['B', 'C', 'D', 'E', 'F']; // Columns B, C, D, E, F correspond to 'Customer ID', 'Name', 'Address', 'Customer Number', 'Joined Date'
    boldColumns.forEach((column) => {
      const cellAddress = column + '1'; // Assuming the header row is at index 1
      worksheet[cellAddress].s = boldCellStyle;
    });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Profiles');

    // Generate an Excel file buffer
    const excelFileBuffer = XLSXStyle.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the response headers for downloading the file
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=UserProfiles.xlsx',
    });

    // Send the Excel file as the response
    res.send(excelFileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};




