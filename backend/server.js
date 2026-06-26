// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const detailsRoutes = require("./routes/detailsRoutes");
// const clientRoutes = require("./routes/clientRoutes");
// const transportRoutes = require("./routes/transportRoutes");

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB connection failed:", err));

// // Routes
// app.use("/api/details", detailsRoutes);
// app.use("/api/clients", clientRoutes);
// app.use("/api/transports", transportRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


//code is changing



// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const detailsRoutes = require("./routes/detailsRoutes");
const clientRoutes = require("./routes/clientRoutes");
const transportRoutes = require("./routes/transportRoutes");

// Load environment variables
dotenv.config({ override: true });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined. Set it in Railway Environment Variables.");
  process.exit(1); // Stop server if URI missing
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Stop server if connection fails
  });

// Routes
app.use("/api/details", detailsRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/transports", transportRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
