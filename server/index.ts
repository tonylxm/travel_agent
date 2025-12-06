// import express from "express";
// import cors from "cors";
// // import dotenv from "dotenv";

// // dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());


// const PORT = process.env.PORT || 4001;
// app.listen(PORT, () => {
//   console.log(`🔥 Server running on port ${PORT}`);
// });



// app.get("/", async (req, res) => {
//   console.log("hi starting");

//   // try {
//   //   const json = await getJson({
//   //     engine: "google_flights",
//   //     departure_id: "PEK",
//   //     arrival_id: "AUS",
//   //     outbound_date: "2025-12-07",
//   //     return_date: "2025-12-13",
//   //     currency: "USD",
//   //     hl: "en",
//   //     api_key: process.env.SERP_API_KEY, // put it in .env!
//   //   });

//   //   return res.status(200).json({ message: "Successfully retrieved flights", data: json });
//   // } catch (err: any) {
//   //   console.error(err);
//   //   return res.status(500).json({ error: err.message });
//   // }
//   return res.json({message: "hi"})
// });

const express = require("express");
const cors = require("cors");
const { getJson } = require("serpapi");

const app = express();
app.use(cors()); // Allow all origins

// Basic GET endpoint
app.get("/flights", async (req: any, res: any) => {
  try {
      const json = await getJson({
        engine: "google_flights",
        departure_id: "PEK",
        arrival_id: "AUS",
        outbound_date: "2025-12-07",
        return_date: "2025-12-13",
        currency: "USD",
        hl: "en",
        api_key: "5580196c75876369baeda8174d41c1950a26aa121582579439d5fa1c888c5458",
      });
      return res.status(200).json({ message: "Successfully retrieved flights", data: json });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
});

app.get("/hotels", async (req: any, res: any) => {
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
        api_key: "5580196c75876369baeda8174d41c1950a26aa121582579439d5fa1c888c5458",
      });

    return res.status(200).json({ message: "Successfully retrieved hotels", data: json });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Server listener
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
