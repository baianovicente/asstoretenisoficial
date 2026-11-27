const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM settings");
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    if (settings.mpAccessToken) settings.mpAccessToken = "***" + settings.mpAccessToken.slice(-4);
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const { mpAccessToken, pixKey } = req.body;
  try {
    if (mpAccessToken && !mpAccessToken.startsWith("***")) {
      await pool.query("INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = $2", ["mpAccessToken", mpAccessToken]);
    }
    if (pixKey !== undefined) {
      await pool.query("INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = $2", ["pixKey", pixKey]);
    }
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;