const mongoose = require("mongoose");
const User = require("./userModel");

const roomSchema = new mongoose.Schema({
 
  participants: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming there is a User model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming there is a User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
