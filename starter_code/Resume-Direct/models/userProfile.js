const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true},
  work: String,
  interests: String,
  profile: String

});


const userProfile = mongoose.model("userProfile", userSchema);


module.exports = userProfile;