const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
};

const validateMobileNo = (Number) => {
  return /^[6789][0-9]{9}$/g.test(Number);
};

const flatNoRegex = (flatNo) => {
  return /^[a-zA-Z0-9\s]+$/.test(flatNo)
};

const streetRegex =  (street) => {
  return /^[a-zA-Z\s]+$/.test(street)
}
module.exports = {
  validateEmail,
  validateMobileNo,
  flatNoRegex,
  streetRegex,
};
