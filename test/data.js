const moment = require("moment");
// Employee account creation
exports.defaultUser = {
  firstname: "Miami",
  lastname: "Larry",
  email: "miamielarry@gmail.com",
  password: "Pass2word!",
  gender: "Male",
  job_role: "Software Developer",
  department: "IT",
  address: "Nairobi Kenya"
};

exports.testUser1 = {
  firstName: "Joy",
  lastName: "Ejiofor",
  email: "joy.ejiofoh@andela.com",
  password: "PasswordReset",
  gender: "Female",
  jobRole: "Lead",
  department: "Developer Relations",
  address: "Lagos, Nigeria"
};

exports.testUser2 = {
  firstName: "Kevin",
  lastName: "Engaywa",
  email: "vokestops@gmail.com",
  password: "50filthyCENT!",
  gender: "Male",
  jobRole: "Database Administrator",
  department: "IT",
  address: "Mombasa, Kenya"
};
// Signin data
exports.userLogin = {
  email: "joy.ejiofoh@andela.com",
  password: "PasswordReset"
};
// create a gif post
exports.testGif = {
  title: "FDC",
  image: "image_Gif",
  date: moment()
};
