// Global imports
const router = require("express").Router();

//Local Imports
const systemController = require("../controllers/system");

router.post("/add-user", systemController.addUser);
router.post("/add-checkIn", systemController.addCheckIn);
router.put("/add-checkOut", systemController.addCheckOut);
router.get("/get-instrctor-data", systemController.getInstructorData);

module.exports = router;
