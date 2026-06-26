// const express = require('express');
// const router = express.Router();
// const Client = require('../models/Client');

// // Get all clients
// router.get('/', async (req, res) => {
//   try {
//     const clients = await Client.find().sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // get client details by name
// router.get('/', async (req, res) => {
//   try {
//     const { search } = req.query;

//     let query = {};

//     if (search) {
//       query = {
//         name: { $regex: search, $options: 'i' } // case-insensitive search
//       };
//     }

//     const clients = await Client.find(query).sort({ createdAt: -1 });

//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Create new client
// router.post('/', async (req, res) => {
//   try {
//     const { name, contactNumber, address } = req.body;

//     if (!name || !contactNumber) {
//       return res.status(400).json({ message: 'Name and contact number are required' });
//     }

//     const client = new Client({
//       name,
//       contactNumber,
//       address: address || ''
//     });

//     const newClient = await client.save();
//     res.status(201).json(newClient);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update client
// router.put('/:id', async (req, res) => {
//   try {
//     const { name, contactNumber, address } = req.body;
    
//     const updatedClient = await Client.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         contactNumber,
//         address,
//         updatedAt: Date.now()
//       },
//       { new: true }
//     );

//     if (!updatedClient) {
//       return res.status(404).json({ message: 'Client not found' });
//     }

//     res.json(updatedClient);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete client
// router.delete('/:id', async (req, res) => {
//   try {
//     const client = await Client.findByIdAndDelete(req.params.id);
    
//     if (!client) {
//       return res.status(404).json({ message: 'Client not found' });
//     }

//     res.json({ message: 'Client deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // fetch name + number
// router.get('/', async (req, res) => {
//   try {
//     const clients = await Client.find({}, 'name contactNumber')
//       .sort({ name: 1 }); // alphabetical

//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch clients' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// ----------------------------
// Get all clients
// ----------------------------
router.get('/all', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// Search clients by name
// ----------------------------
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name query is required' });
    }

    const clients = await Client.find({
      name: { $regex: name, $options: 'i' }, // partial name, case-insensitive
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ----------------------------
// Create new client
// ----------------------------
router.post('/', async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;

    if (!name || !contactNumber) {
      return res.status(400).json({ message: 'Name and contact number are required' });
    }

    const client = new Client({ name, contactNumber, address: address || '' });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------
// Update client
// ----------------------------
router.put('/:id', async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { name, contactNumber, address, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedClient) return res.status(404).json({ message: 'Client not found' });

    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------
// Delete client
// ----------------------------
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------------------------
// Fetch name + number
// ----------------------------
// router.get('/names', async (req, res) => {
//   try {
//     const clients = await Client.find({}, 'name contactNumber').sort({ name: 1 });
//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch clients' });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    const clients = await Client.find(query, 'name contactNumber')
      .sort({ name: 1 }); // alphabetical

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
});

module.exports = router;
