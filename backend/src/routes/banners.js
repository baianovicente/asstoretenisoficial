const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM banners WHERE active = true ORDER BY id DESC LIMIT 1");
    res.json(result.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const { title, subtitle, image_url } = req.body;
  try {
    await pool.query("UPDATE banners SET active = false WHERE active = true");
    const result = await pool.query(
      "INSERT INTO banners (title, subtitle, image_url, active) VALUES ($1, $2, $3, true) RETURNING *",
      [title, subtitle, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
