const express = require("express");
const router = express.Router();
const pool = require("../db");

// Listar todos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
      COALESCE(json_agg(json_build_object('id', v.id, 'color_name', v.color_name, 'image_url', v.image_url, 'sizes', v.sizes, 'stock', v.stock)) FILTER (WHERE v.id IS NOT NULL), '[]') as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Buscar um único produto
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
      COALESCE(json_agg(json_build_object('id', v.id, 'color_name', v.color_name, 'image_url', v.image_url, 'sizes', v.sizes, 'stock', v.stock)) FILTER (WHERE v.id IS NOT NULL), '[]') as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Não encontrado" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Criar produto
router.post("/", async (req, res) => {
  const { name, brand, category, price, promoPrice, description, isNew, variants } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const prodResult = await client.query(
      "INSERT INTO products (name, brand, category, price, promo_price, description, is_new, sizes, images, stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [name, brand, category, price, promoPrice || null, description, isNew || false, [], [], 0]
    );
    const newProduct = prodResult.rows[0];

    if (variants && variants.length > 0) {
      for (const v of variants) {
        await client.query(
          "INSERT INTO product_variants (product_id, color_name, image_url, sizes, stock) VALUES ($1,$2,$3,$4,$5)",
          [newProduct.id, v.color_name, v.image_url, v.sizes, v.stock || 10]
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json(newProduct);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Deletar
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// Atualizar produto
router.put("/:id", async (req, res) => {
  const { name, brand, category, price, promoPrice, description, variants } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Atualiza o produto principal
    await client.query(
      "UPDATE products SET name=$1, brand=$2, category=$3, price=$4, promo_price=$5, description=$6 WHERE id=$7",
      [name, brand, category, price, promoPrice || null, description, req.params.id]
    );

    // Deleta as variações antigas e insere as novas
    await client.query("DELETE FROM product_variants WHERE product_id = $1", [req.params.id]);
    
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await client.query(
          "INSERT INTO product_variants (product_id, color_name, image_url, sizes, stock) VALUES ($1,$2,$3,$4,$5)",
          [req.params.id, v.color_name, v.image_url, v.sizes, v.stock || 10]
        );
      }
    }

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
