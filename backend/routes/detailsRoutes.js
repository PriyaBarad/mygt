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

// Get dashboard stats and records
router.get("/dashboard", async (req, res) => {
  try {
    const { filterType, month } = req.query;
    let query = {};

    if (filterType === "weekly") {
      // Calculate current week (Monday to Sunday)
      const today = new Date();
      const day = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
      // Adjust to Monday
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(today.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const formatDateString = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const startStr = formatDateString(monday);
      const endStr = formatDateString(sunday);

      query = { date: { $gte: startStr, $lte: endStr } };
    } else if (filterType === "monthly") {
      // Current calendar month
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const prefix = `${yyyy}-${mm}`;

      query = { date: { $regex: `^${prefix}` } };
    } else if (filterType === "particular" && month) {
      // Specified month: YYYY-MM
      query = { date: { $regex: `^${month}` } };
    }

    const records = await Details.find(query).sort({ date: -1, _id: -1 });

    // Calculate summary statistics
    let totalDispatches = records.length;
    let totalQuantity = 0;
    const goodsBreakdown = {};
    const clientBreakdown = {};
    const transportBreakdown = {};

    records.forEach((record) => {
      // Sum up goods
      if (record.goods && Array.isArray(record.goods)) {
        record.goods.forEach((item) => {
          const qty = parseInt(item.quantity) || 0;
          totalQuantity += qty;

          if (item.goodsName) {
            goodsBreakdown[item.goodsName] = (goodsBreakdown[item.goodsName] || 0) + qty;
          }
        });
      } else if (record.goodsName) {
        // Fallback for older schema if any
        const qty = parseInt(record.quantity) || 0;
        totalQuantity += qty;
        goodsBreakdown[record.goodsName] = (goodsBreakdown[record.goodsName] || 0) + qty;
      }

      // Client Breakdown
      if (record.receiverName) {
        clientBreakdown[record.receiverName] = (clientBreakdown[record.receiverName] || 0) + 1;
      }

      // Transport Breakdown
      if (record.transportName) {
        transportBreakdown[record.transportName] = (transportBreakdown[record.transportName] || 0) + 1;
      }
    });

    res.status(200).json({
      records,
      summary: {
        totalDispatches,
        totalQuantity,
        goodsBreakdown,
        clientBreakdown,
        transportBreakdown,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data", error });
  }
});

// Get all details (optionally filtered by search term)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { receiverName: { $regex: search, $options: "i" } };
    }
    const details = await Details.find(query).sort({ _id: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error });
  }
});

module.exports = router;
