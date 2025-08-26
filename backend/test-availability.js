const axios = require("axios");

const BASE_URL = "http://localhost:4500/api";

// Test data for creating availabilities
const testAvailabilities = {
  availabilities: [
    {
      dayOfWeek: 1, // Monday
      startTime: "09:00",
      endTime: "12:00",
      consultationDuration: 30,
      consultationType: "online",
      consultationFee: 5000,
      maxPatients: 6,
    },
    {
      dayOfWeek: 2, // Tuesday
      startTime: "14:00",
      endTime: "17:00",
      consultationDuration: 45,
      consultationType: "both",
      consultationFee: 7500,
      maxPatients: 4,
    },
    {
      dayOfWeek: 3, // Wednesday
      startTime: "10:00",
      endTime: "13:00",
      consultationDuration: 30,
      consultationType: "physical",
      consultationFee: 10000,
      maxPatients: 6,
    },
  ],
};

// Test the availability endpoints
async function testAvailabilityEndpoints() {
  try {
    console.log("🧪 Testing Doctor Availability Endpoints...\n");

    // Note: You'll need to replace this with a valid doctor token
    const authToken = "YOUR_DOCTOR_AUTH_TOKEN_HERE";

    if (authToken === "YOUR_DOCTOR_AUTH_TOKEN_HERE") {
      console.log("⚠️  Please set a valid doctor auth token to run the tests");
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    };

    // Test 1: Create availabilities
    console.log("1️⃣ Testing CREATE availabilities...");
    try {
      const createResponse = await axios.post(
        `${BASE_URL}/doctor-availability`,
        testAvailabilities,
        { headers }
      );
      console.log(
        "✅ Create availabilities successful:",
        createResponse.data.message
      );
      console.log(
        "   Created:",
        createResponse.data.data.length,
        "availabilities\n"
      );
    } catch (error) {
      console.log(
        "❌ Create availabilities failed:",
        error.response?.data?.message || error.message,
        "\n"
      );
    }

    // Test 2: Get all availabilities
    console.log("2️⃣ Testing GET all availabilities...");
    try {
      const getAllResponse = await axios.get(
        `${BASE_URL}/doctor-availability`,
        { headers }
      );
      console.log("✅ Get all availabilities successful");
      console.log(
        "   Found:",
        getAllResponse.data.data.length,
        "availabilities\n"
      );
    } catch (error) {
      console.log(
        "❌ Get all availabilities failed:",
        error.response?.data?.message || error.message,
        "\n"
      );
    }

    // Test 3: Get available doctors (for patients)
    console.log("3️⃣ Testing GET available doctors...");
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split("T")[0];

      const getDoctorsResponse = await axios.get(
        `${BASE_URL}/doctor-availability/available-doctors?date=${dateString}`,
        { headers }
      );
      console.log("✅ Get available doctors successful");
      console.log(
        "   Found:",
        getDoctorsResponse.data.data.length,
        "available doctors\n"
      );
    } catch (error) {
      console.log(
        "❌ Get available doctors failed:",
        error.response?.data?.message || error.message,
        "\n"
      );
    }

    console.log("🎉 Availability endpoint tests completed!");
  } catch (error) {
    console.error("💥 Test failed:", error.message);
  }
}

// Run the tests
testAvailabilityEndpoints();
