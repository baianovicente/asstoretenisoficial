const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '../models/orders.json');

function readOrders() {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
}
function saveOrders(list) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2));
}

function validateSignature(xSignature, xRequestId, dataId) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret || !xSignature || !dataId || !xRequestId) return false;

  const parts = Object.fromEntries(
    xSignature.split(',').map(p => p.split('=').map(s => s.trim()))
  );
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;

  const canonical = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

  return expected.length === v1.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

router.post('/mercadopago', async (req, res) => {
  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];
  const dataId = req.body?.data?.id;

  if (!validateSignature(xSignature, xRequestId, dataId)) {
    return res.status(401).end();
  }

  res.status(200).end();

  queueMicrotask(async () => {
    try {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      const payment = await mpRes.json();

      if (payment.status === 'approved') {
        const ref = payment.external_reference;
        const orders = readOrders();
        const idx = orders.findIndex(o => o.id === ref);
        if (idx !== -1 && orders[idx].status !== 'paid') {
          orders[idx].status = 'paid';
          orders[idx].paidAt = new Date().toISOString();
          orders[idx].mpPaymentId = payment.id;
          saveOrders(orders);
        }
      }
    } catch (err) {
      console.error('Erro no webhook:', err.message);
    }
  });
});

module.exports = router;
