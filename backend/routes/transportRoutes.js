// const express = require('express');
// const router = express.Router();
// const Transport = require('../models/Transport');

// // Get all transports
// router.get('/', async (req, res) => {
//   try {
//     const transports = await Transport.find().sort({ createdAt: -1 });
//     res.json(transports);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create new transport
// router.post('/', async (req, res) => {
//   try {
//     const { companyName, contactNumber, driverName, vehicleNumber } = req.body;

//     if (!companyName || !contactNumber) {
//       return res.status(400).json({ message: 'Company name and contact number are required' });
//     }

//     const transport = new Transport({
//       companyName,
//       contactNumber,
//       driverName: driverName || '',
//       vehicleNumber: vehicleNumber || ''
//     });

//     const newTransport = await transport.save();
//     res.status(201).json(newTransport);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update transport
// router.put('/:id', async (req, res) => {
//   try {
//     const { companyName, contactNumber, driverName, vehicleNumber } = req.body;
    
//     const updatedTransport = await Transport.findByIdAndUpdate(
//       req.params.id,
//       {
//         companyName,
//         contactNumber,
//         driverName,
//         vehicleNumber,
//         updatedAt: Date.now()
//       },
//       { new: true }
//     );

//     if (!updatedTransport) {
//       return res.status(404).json({ message: 'Transport not found' });
//     }

//     res.json(updatedTransport);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete transport
// router.delete('/:id', async (req, res) => {
//   try {
//     const transport = await Transport.findByIdAndDelete(req.params.id);
    
//     if (!transport) {
//       return res.status(404).json({ message: 'Transport not found' });
//     }

//     res.json({ message: 'Transport deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// //fetch name + number
// router.get('/', async (req, res) => {
//   try {
//     const transports = await Transport.find({}, 'companyName contactNumber')
//       .sort({ companyName: 1 }); // alphabetical

//     res.status(200).json(transports);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch transports' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');

// ----------------------------
// Get all transports
// ----------------------------
router.get('/all', async (req, res) => {
  try {
    const transports = await Transport.find().sort({ createdAt: -1 });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// Search transport by company name
// ----------------------------
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name query is required' });
    }

    const transports = await Transport.find({
      companyName: { $regex: name, $options: 'i' } // partial match, case-insensitive
    });

    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ----------------------------
// Create new transport
// ----------------------------
router.post('/', async (req, res) => {
  try {
    const { companyName, contactNumber, driverName, vehicleNumber } = req.body;

    if (!companyName || !contactNumber) {
      return res.status(400).json({ message: 'Company name and contact number are required' });
    }

    const transport = new Transport({
      companyName,
      contactNumber,
      driverName: driverName || '',
      vehicleNumber: vehicleNumber || ''
    });

    const newTransport = await transport.save();
    res.status(201).json(newTransport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------
// Update transport
// ----------------------------
router.put('/:id', async (req, res) => {
  try {
    const { companyName, contactNumber, driverName, vehicleNumber } = req.body;

    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      { companyName, contactNumber, driverName, vehicleNumber, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTransport) return res.status(404).json({ message: 'Transport not found' });

    res.json(updatedTransport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------
// Delete transport
// ----------------------------
router.delete('/:id', async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);

    if (!transport) return res.status(404).json({ message: 'Transport not found' });

    res.json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { companyName: { $regex: search, $options: 'i' } };
    }
    const transports = await Transport.find(query, 'companyName contactNumber')
      .sort({ companyName: 1 }); // alphabetical

    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transports' });
  }
});
module.exports = router;
