const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");

// Aliased Express types to avoid DOM conflicts
type ExRequest = import("express").Request;
type ExResponse = import("express").Response;
type ExNext = import("express").NextFunction;

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// POST /flights endpoint
app.post("/flights", async (req: ExRequest, res: ExResponse) => {
  console.log("Request body:", req.body);

  const { departure_id, arrival_id, outbound_date, return_date, currency } = req.body;

  if (!departure_id || !arrival_id || !outbound_date || !return_date) {
    return res.status(400).json({ message: "Missing required flight information." });
  }

  const flightCurrency = currency || "NZD";

  try {
    const json = await getJson({
      engine: "google_flights",
      departure_id,
      arrival_id,
      outbound_date,
      return_date,
      currency: flightCurrency,
      hl: "en",
      api_key: "5580196c75876369baeda8174d41c1950a26aa121582579439d5fa1c888c5458", // <-- use env variable
    });

    return res.status(200).json({ message: "Successfully retrieved flights", data: json });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /hotels endpoint
app.get("/hotels", async (req: ExRequest, res: ExResponse) => {
  try {
    const json = await getJson({
      engine: "google_hotels",
      q: "Bali Resorts",
      check_in_date: "2025-12-07",
      check_out_date: "2025-12-08",
      adults: "2",
      currency: "USD",
      gl: "us",
      hl: "en",
      property_token: "ChcI9uq9hrWO2OtjGgsvZy8xMjJ0YzFteBAB",
      api_key: process.env.SERP_API_KEY, // <-- use env variable
    });

    return res.status(200).json({ message: "Successfully retrieved hotels", data: json });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});