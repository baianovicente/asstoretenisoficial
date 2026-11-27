const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "E-mail inválido" });
  try {
    const exists = await pool.query("SELECT * FROM newsletter WHERE email = $1", [email]);
    if (exists.rows.length > 0) return res.json({ ok: true, message: "Você já está inscrito!", coupon: "BEMVINDO10" });
    await pool.query("INSERT INTO newsletter (email, coupon) VALUES ($1, $2)", [email, "BEMVINDO10"]);
    res.json({ ok: true, message: "Cupom liberado!", coupon: "BEMVINDO10" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM newsletter ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;