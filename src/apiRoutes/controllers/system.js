const mongoose = require("mongoose");

const {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require("../../utils/response");
const { User } = require("../model/user");
const { TimeSlot } = require("../model/timeSlots");

/**
 * @function isTimeSlotAvailable
 * @description function to check for available time slots
 */
function isTimeSlotAvailable(dates, checkedInTime) {
  for (const entry of dates) {
    const startTime = new Date(
      `${entry.date.toDateString()} ${entry.checkedIn}`
    );
    const endTime = new Date(
      `${entry.date.toDateString()} ${entry.checkedOut}`
    );

    const checkedIn = new Date(`${entry.date.toDateString()} ${checkedInTime}`);
    if (checkedIn >= startTime && checkedIn <= endTime) {
      return false; // Time slot overlaps
    }
  }
  return true; // Time slot does not overlap
}

/**
 * @function addUser
 * @description function to add user
 * @method POST
 */
exports.addUser = async (req, res) => {
  try {
    if (!req.body.firstName)
      return clientErrorResponse(res, "Enter First Name!");
    if (!req.body.lastName) return clientErrorResponse(res, "Enter Last Name!");
    if (!req.body.phoneNumber)
      return clientErrorResponse(res, "Enter Phone Number!");
    // req.body.phoneNumber = req.body.phoneNumber;
    req.body.phoneNumber = `+91${req.body.phoneNumber.slice(-10)}`;

    await User.create(req.body);
    return successResponse(res, "User Added Successfully!");
  } catch (error) {
    return serverErrorResponse(res);
  }
};

/**
 * @function addCheckIn
 * @description function to add check in time
 * @method POST
 */
exports.addCheckIn = async (req, res) => {
  try {
    if (!req.body.userId) return clientErrorResponse(res, "Enter User Id!");
    if (!mongoose.isValidObjectId(req.body.userId))
      return clientErrorResponse(res, "Invalid User Id!");
    if (!req.body.date) return clientErrorResponse(res, "Input Date!");
    req.body.month = req.body.date.split("-").at(1);

    if (!req.body.checkedIn)
      return clientErrorResponse(res, "Enter Checked In Time!");
    const checkedInTime = req.body.checkedIn;

    let isPresent = await TimeSlot.find(
      {
        userId: req.body.userId,
        date: req.body.date,
      },
      { _id: 0, createdAt: 0, updatedAt: 0, userId: 0 }
    );

    if (isPresent.length > 0 && !isPresent.at(-1).checkedOut)
      return clientErrorResponse(
        res,
        "Cannot CheckIn, Need to CheckOut First!"
      );

    if (isPresent.length > 0) {
      const a = `${isPresent.at(-1).date.toDateString()} ${
        isPresent.at(-1).checkedIn
      }`;
      const b = `${isPresent.at(-1).date.toDateString()} ${checkedInTime}`;

      if (a >= b) return clientErrorResponse(res, "Invalid Checked In Time!");
    }

    const isAvailable = isTimeSlotAvailable(isPresent, checkedInTime);

    if (!isAvailable) return clientErrorResponse(res, "Invalid CheckIn Time!");

    await TimeSlot.create(req.body);

    return successResponse(res, "CheckIn Time Added Successfully!");
  } catch (error) {
    return serverErrorResponse(res);
  }
};

/**
 * @function addCheckOut
 * @description function to add check out time
 * @method PUT
 */
exports.addCheckOut = async (req, res) => {
  try {
    if (!req.body.userId) return clientErrorResponse(res, "Enter User Id!");
    if (!mongoose.isValidObjectId(req.body.userId))
      return clientErrorResponse(res, "Invalid User Id!");
    if (!req.body.checkedOut)
      return clientErrorResponse(res, "Enter Checked Out Time!");
    const checkedOutTime = req.body.checkedOut;

    let isPresent = await TimeSlot.find({
      userId: req.body.userId,
      date: req.body.date,
    });

    if (!isPresent.length)
      return clientErrorResponse(res, "Input CheckedIn Time!");

    if (isPresent.length > 0 && isPresent.at(-1).checkedOut)
      return clientErrorResponse(
        res,
        "Already Checked Out, Please Check In Again!"
      );

    const a = `${isPresent.at(-1).date.toDateString()} ${
      isPresent.at(-1).checkedIn
    }`;
    const b = `${isPresent.at(-1).date.toDateString()} ${checkedOutTime}`;

    if (a >= b) return clientErrorResponse(res, "Invalid Checked Out Time!");

    await TimeSlot.updateOne(
      { _id: isPresent.at(-1)._id },
      { checkedOut: req.body.checkedOut },
      { new: true }
    );
    return successResponse(res, "CheckOut Time Added Successfully!");
  } catch (error) {
    return serverErrorResponse(res);
  }
};

/**
 * @function getInstructorData
 * @description function to get instructors report month wise
 * @method GET
 */
exports.getInstructorData = async (req, res) => {
  try {
    if (!req.query.month)
      return clientErrorResponse(
        res,
        "Select month [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec] to get Report!"
      );
    const monthObj = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    const getData = await TimeSlot.aggregate([
      {
        $match: {
          month: monthObj[req.query.month],
        },
      },
      {
        $group: {
          _id: "$userId",
          data: {
            $push: {
              date: "$date",
              checkedIn: "$checkedIn",
              checkedOut: "$checkedOut",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          instructorName: {
            $concat: ["$userData.firstName", " ", "$userData.lastName"],
          },
          totalCheckedIn: {
            $size: "$data",
          },
        },
      },
      {
        $project: {
          instructorName: "$instructorName",
          totalCheckedIn: "$totalCheckedIn",
          userData: "$data",
        },
      },
    ]);

    if (!getData.length)
      return clientErrorResponse(res, `No Report for ${req.query.month} Month`);

    return successResponse(res, `Report for ${req.query.month} Month`, getData);
  } catch (error) {
    return serverErrorResponse(res);
  }
};
