const mongoose = require("mongoose");

const timeSlotSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
    month: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    checkedIn: {
      type: String,
      default: "",
    },
    checkedOut: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

exports.TimeSlot = mongoose.model("timeslot", timeSlotSchema);
