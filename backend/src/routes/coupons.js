const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM coupons ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  const { code, type, value } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO coupons (code, type, value) VALUES ($1,$2,$3) RETURNING *",
      [code.toUpperCase(), type, value]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM coupons WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/validate", async (req, res) => {
  const { code, cartTotal } = req.body;
  try {
    const result = await pool.query("SELECT * FROM coupons WHERE code = $1 AND active = true", [code.toUpperCase()]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Cupom inválido" });
    const c = result.rows[0];
    let discount = c.type === "percent" ? (Number(cartTotal) * c.value) / 100 : Number(c.value);
    if (discount > cartTotal) discount = cartTotal;
    res.json({ valid: true, code: c.code, type: c.type, value: c.value, discount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;