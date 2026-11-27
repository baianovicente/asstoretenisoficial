const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const pool = require("../db");

const BANNERS_DIR = path.join(__dirname, "../../../frontend/public/banners");

router.get("/", async (req, res) => {
  try {
const result = await pool.query(
  "SELECT * FROM banners WHERE active = true ORDER BY id DESC LIMIT 1"
);
res.json(result.rows[0] || null);
  } catch (err) {
res.status(500).json({ error: err.message });
  }
});

router.post(
  "/upload",
  express.raw({ type: "application/octet-stream", limit: "15mb" }),
  async (req, res) => {
try {
  if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
    return res.status(400).json({ error: "Arquivo vazio ou inválido" });
  }

  const rawName = String(req.headers["x-filename"] || "banner.png");
  const ext = path.extname(rawName).toLowerCase();
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const safeExt = allowed.includes(ext) ? ext : ".png";
  const fileName = "banner-" + Date.now() + safeExt;

  fs.mkdirSync(BANNERS_DIR, { recursive: true });
  const fullPath = path.join(BANNERS_DIR, fileName);
  fs.writeFileSync(fullPath, req.body);

  return res.status(201).json({ url: "/banners/" + fileName });
} catch (err) {
  return res.status(500).json({ error: err.message });
}
  }
);

router.post("/", async (req, res) => {
  const { title, subtitle, image_url, background_image, product_image } = req.body;
  try {
await pool.query("UPDATE banners SET active = false WHERE active = true");
const result = await pool.query(
  `INSERT INTO banners (title, subtitle, image_url, background_image, product_image, active)
   VALUES ($1, $2, $3, $4, $5, true)
   RETURNING *`,
  [title || "", subtitle || "", image_url || "", background_image || "", product_image || ""]
);
res.status(201).json(result.rows[0]);
  } catch (err) {
res.status(500).json({ error: err.message });
  }
});

module.exports = router;
