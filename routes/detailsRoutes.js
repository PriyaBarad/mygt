// const express = require("express");
// const Details = require ('../models/Details.js');

// const router = express.Router();

// // ✅ Add a new goods detail
// router.post("/", async (req, res) => {
//   try {
//     const newDetail = new Details(req.body);
//     await newDetail.save();
//     res.status(201).json({ message: "Details added successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving details", error });
//   }
// });

// // ✅ Get all goods details
// router.get("/", async (req, res) => {
//   try {
//     const details = await Details.find();
//     res.status(200).json(details);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching details", error });
//   }
// });

// module.exports = router;



const express = require("express");
const Details = require("../models/Details"); // Your mongoose model
const router = express.Router();

// Add new detail
router.post("/", async (req, res) => {
  try {
    const newDetail = new Details(req.body);
    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(500).json({ message: "Failed to save", error });
  }
});

// Get all details
router.get("/", async (req, res) => {
  try {
    const details = await Details.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error });
  }
});

module.exports = router;
