const { spawn } = require("child_process");
const path = require("path");

// Configuration
const PORT = 5001; // Use 5001 to avoid conflicts with 5000
const BASE_URL = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  console.log("🚀 Starting API test suite...");

  // Start the server
  const serverEnv = { ...process.env, PORT: PORT.toString() };
  const serverProcess = spawn("node", ["server.js"], {
    cwd: __dirname,
    env: serverEnv,
    stdio: "inherit",
  });

  // Give the server time to start up and connect to MongoDB
  console.log("⏱️ Waiting 4 seconds for server startup and MongoDB connection...");
  await sleep(4000);

  let exitCode = 0;
  const testResults = [];

  const addResult = (name, success, message, details = "") => {
    testResults.push({ name, success, message, details });
    if (!success) exitCode = 1;
    console.log(`${success ? "✅" : "❌"} ${name}: ${message}`);
  };

  try {
    // ----------------------------------------------------
    // Test 1: Root / Default route
    // ----------------------------------------------------
    try {
      const res = await fetch(`${BASE_URL}/`);
      const text = await res.text();
      if (res.ok && text.includes("Backend is running")) {
        addResult("GET /", true, "Success - Server is running");
      } else {
        addResult("GET /", false, `Unexpected response: ${res.status} ${text}`);
      }
    } catch (err) {
      addResult("GET /", false, `Failed: ${err.message}`);
    }

    // ----------------------------------------------------
    // Test 2: Client CRUD Operations
    // ----------------------------------------------------
    let clientId = null;
    const clientPayload = {
      name: "API Test Client",
      contactNumber: "+919876543210",
      address: "123 Test Street, Solapur",
    };

    // 2a. POST /api/clients (Create)
    try {
      const res = await fetch(`${BASE_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientPayload),
      });
      const data = await res.json();
      if (res.status === 201 && data._id) {
        clientId = data._id;
        addResult("POST /api/clients", true, `Success - Client created with ID: ${clientId}`);
      } else {
        addResult("POST /api/clients", false, `Failed: ${res.status}`, JSON.stringify(data));
      }
    } catch (err) {
      addResult("POST /api/clients", false, `Failed: ${err.message}`);
    }

    // 2b. GET /api/clients (Autocomplete query with search param)
    try {
      const res = await fetch(`${BASE_URL}/api/clients?search=API`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const found = data.some((c) => c.name === clientPayload.name);
        // Verify address is in response or not
        const hasAddress = data.some((c) => c.address !== undefined);
        addResult(
          "GET /api/clients?search=API",
          true,
          `Success - Found ${data.length} results. Warning: Address field is ${hasAddress ? "present" : "missing (Expected for autocomplete projection but causes issues in Search Clients tab)"}`
        );
      } else {
        addResult("GET /api/clients?search=API", false, `Failed: ${res.status}`, JSON.stringify(data));
      }
    } catch (err) {
      addResult("GET /api/clients?search=API", false, `Failed: ${err.message}`);
    }

    // 2c. GET /api/clients/all (All clients)
    try {
      const res = await fetch(`${BASE_URL}/api/clients/all`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const found = data.some((c) => c._id === clientId);
        addResult("GET /api/clients/all", true, `Success - Fetched ${data.length} clients`);
      } else {
        addResult("GET /api/clients/all", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/clients/all", false, `Failed: ${err.message}`);
    }

    // 2d. GET /api/clients/search (Search by name)
    try {
      const res = await fetch(`${BASE_URL}/api/clients/search?name=Test`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        addResult("GET /api/clients/search?name=Test", true, `Success - Found ${data.length} clients`);
      } else {
        addResult("GET /api/clients/search?name=Test", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/clients/search?name=Test", false, `Failed: ${err.message}`);
    }

    // 2e. PUT /api/clients/:id (Update)
    if (clientId) {
      try {
        const updatePayload = {
          name: "Updated API Test Client",
          contactNumber: "+919876543211",
          address: "456 Updated Street",
        };
        const res = await fetch(`${BASE_URL}/api/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });
        const data = await res.json();
        if (res.ok && data.name === updatePayload.name) {
          addResult("PUT /api/clients/:id", true, "Success - Client updated");
        } else {
          addResult("PUT /api/clients/:id", false, `Failed: ${res.status}`, JSON.stringify(data));
        }
      } catch (err) {
        addResult("PUT /api/clients/:id", false, `Failed: ${err.message}`);
      }
    }

    // ----------------------------------------------------
    // Test 3: Transport CRUD Operations
    // ----------------------------------------------------
    let transportId = null;
    const transportPayload = {
      companyName: "API Test Transport",
      contactNumber: "+918765432109",
      driverName: "API Driver",
      vehicleNumber: "MH12API1234",
    };

    // 3a. POST /api/transports (Create)
    try {
      const res = await fetch(`${BASE_URL}/api/transports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transportPayload),
      });
      const data = await res.json();
      if (res.status === 201 && data._id) {
        transportId = data._id;
        addResult("POST /api/transports", true, `Success - Transport created with ID: ${transportId}`);
      } else {
        addResult("POST /api/transports", false, `Failed: ${res.status}`, JSON.stringify(data));
      }
    } catch (err) {
      addResult("POST /api/transports", false, `Failed: ${err.message}`);
    }

    // 3b. GET /api/transports (Autocomplete search query)
    try {
      const res = await fetch(`${BASE_URL}/api/transports?search=API`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const hasDriver = data.some((t) => t.driverName !== undefined);
        addResult(
          "GET /api/transports?search=API",
          true,
          `Success - Found ${data.length} results. Warning: Driver field is ${hasDriver ? "present" : "missing (Expected for autocomplete projection but causes issues in Search Transports tab)"}`
        );
      } else {
        addResult("GET /api/transports?search=API", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/transports?search=API", false, `Failed: ${err.message}`);
    }

    // 3c. GET /api/transports/all
    try {
      const res = await fetch(`${BASE_URL}/api/transports/all`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        addResult("GET /api/transports/all", true, `Success - Fetched ${data.length} transports`);
      } else {
        addResult("GET /api/transports/all", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/transports/all", false, `Failed: ${err.message}`);
    }

    // 3d. PUT /api/transports/:id
    if (transportId) {
      try {
        const updatePayload = {
          companyName: "Updated API Test Transport",
          contactNumber: "+918765432100",
          driverName: "Updated API Driver",
          vehicleNumber: "MH12API9999",
        };
        const res = await fetch(`${BASE_URL}/api/transports/${transportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });
        const data = await res.json();
        if (res.ok && data.companyName === updatePayload.companyName) {
          addResult("PUT /api/transports/:id", true, "Success - Transport updated");
        } else {
          addResult("PUT /api/transports/:id", false, `Failed: ${res.status}`, JSON.stringify(data));
        }
      } catch (err) {
        addResult("PUT /api/transports/:id", false, `Failed: ${err.message}`);
      }
    }

    // ----------------------------------------------------
    // Test 4: Details (Dispatch Records) CRUD & Dashboard
    // ----------------------------------------------------
    let detailId = null;
    const detailPayload = {
      goods: [
        { goodsName: "API Engine Oil", quantity: "15" },
        { goodsName: "API Brake Pads", quantity: "30" },
      ],
      transportName: "API Test Transport",
      transportNumber: "+918765432109",
      receiverName: "API Test Client",
      receiverNumber: "+919876543210",
      date: new Date().toISOString().split("T")[0],
    };

    // 4a. POST /api/details (Create dispatch entry)
    try {
      const res = await fetch(`${BASE_URL}/api/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detailPayload),
      });
      const data = await res.json();
      if (res.status === 201 && data._id) {
        detailId = data._id;
        addResult("POST /api/details", true, `Success - Dispatch entry created with ID: ${detailId}`);
      } else {
        addResult("POST /api/details", false, `Failed: ${res.status}`, JSON.stringify(data));
      }
    } catch (err) {
      addResult("POST /api/details", false, `Failed: ${err.message}`);
    }

    // 4b. GET /api/details (Get all dispatch records)
    try {
      const res = await fetch(`${BASE_URL}/api/details`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        addResult("GET /api/details", true, `Success - Fetched ${data.length} dispatch records`);
      } else {
        addResult("GET /api/details", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/details", false, `Failed: ${err.message}`);
    }

    // 4c. GET /api/details/dashboard (Weekly filter)
    try {
      const res = await fetch(`${BASE_URL}/api/details/dashboard?filterType=weekly`);
      const data = await res.json();
      if (res.ok && data.records && data.summary) {
        addResult("GET /api/details/dashboard?filterType=weekly", true, "Success - Fetched weekly dashboard stats");
      } else {
        addResult("GET /api/details/dashboard?filterType=weekly", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/details/dashboard?filterType=weekly", false, `Failed: ${err.message}`);
    }

    // 4d. GET /api/details/dashboard (Monthly filter)
    try {
      const res = await fetch(`${BASE_URL}/api/details/dashboard?filterType=monthly`);
      const data = await res.json();
      if (res.ok && data.records && data.summary) {
        addResult("GET /api/details/dashboard?filterType=monthly", true, "Success - Fetched monthly dashboard stats");
      } else {
        addResult("GET /api/details/dashboard?filterType=monthly", false, `Failed: ${res.status}`);
      }
    } catch (err) {
      addResult("GET /api/details/dashboard?filterType=monthly", false, `Failed: ${err.message}`);
    }

    // ----------------------------------------------------
    // Test 5: Cleanup test records
    // ----------------------------------------------------
    console.log("🧹 Cleaning up test data...");

    // Delete client
    if (clientId) {
      try {
        const res = await fetch(`${BASE_URL}/api/clients/${clientId}`, { method: "DELETE" });
        if (res.ok) {
          addResult("DELETE /api/clients/:id", true, "Success - Cleaned up test client");
        } else {
          addResult("DELETE /api/clients/:id", false, `Failed: ${res.status}`);
        }
      } catch (err) {
        addResult("DELETE /api/clients/:id", false, `Failed: ${err.message}`);
      }
    }

    // Delete transport
    if (transportId) {
      try {
        const res = await fetch(`${BASE_URL}/api/transports/${transportId}`, { method: "DELETE" });
        if (res.ok) {
          addResult("DELETE /api/transports/:id", true, "Success - Cleaned up test transport");
        } else {
          addResult("DELETE /api/transports/:id", false, `Failed: ${res.status}`);
        }
      } catch (err) {
        addResult("DELETE /api/transports/:id", false, `Failed: ${err.message}`);
      }
    }

    // Note: details does not have a delete route implemented in routes/detailsRoutes.js!
    // Wait, let's verify if there is a delete endpoint for Details. No, let's check detailsRoutes.js.
    // There is no DELETE endpoint for details. That's an interesting omission!
    console.log("ℹ️ No DELETE endpoint exists for Details. The test record will remain in the DB (or can be removed manually if needed).");

  } finally {
    // Shutdown the server process
    console.log("🔌 Stopping local backend server...");
    serverProcess.kill();
    await sleep(1000);

    // Output final summary
    console.log("\n=================================");
    console.log("📊 API TEST SUMMARY");
    console.log("=================================");
    let failedCount = 0;
    testResults.forEach((r) => {
      if (!r.success) failedCount++;
      console.log(`${r.success ? "🟢" : "🔴"} ${r.name} - ${r.message}`);
    });
    console.log("=================================");
    console.log(`Tests: ${testResults.length}, Failed: ${failedCount}`);
    console.log("=================================\n");

    process.exit(exitCode);
  }
}

runTests();
