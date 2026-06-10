import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const ORS_KEY = process.env.ORS_KEY;

if (!ORS_KEY) {
  console.warn("WARNING: ORS_KEY is not set. Set it in Render environment variables.");
}

app.use(cors());
app.use(express.json());

app.post("/route", async (req, res) => {
  try {
    // FIXED: Updated to the official, stable production endpoint with the required /json ending
    const orsUrl = "https://api.openrouteservice.org/v2/directions/driving-hgv/json";

    const response = await fetch(orsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": ORS_KEY
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("ORS error:", text);
      return res.status(response.status).send(text);
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Routing failed on backend" });
  }
});

app.get("/", (req, res) => {
  res.send("RigRoute backend is running.");
});

app.listen(PORT, () => {
  console.log(`RigRoute backend listening on port ${PORT}`);
});
