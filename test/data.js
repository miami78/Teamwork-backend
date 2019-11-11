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
exports.defaultArticle = {
  title: "Rename a local and remote branch in git",
  article:
    "If you have named a branch incorrectly AND pushed this to the remote repository follow these steps before any other developers get a chance to jump on you"
};
exports.editedArticle = {
  title: "Best Practices for Designing a Pragmatic RESTful API",
  article:
    "Your data model has started to stabilize and you're in a position to create a public API for your web app. You realize it's hard to make significant changes to your API once it's released"
};
exports.comment1 = {
  comment: "Shut up Karen"
};
exports.comment2 = {
  comment: "Really Karen?"
};
exports.feed = {
  constructor(testGif, defaultArticle, editedArticle) {
    this.testGif = testGif;
    this.defaultArticle = defaultArticle;
    this.editedArticle = editedArticle;
  }
};
