const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Order } = require("mercadopago");
const QRCode = require("qrcode");

router.post("/pix", async (req, res) => {
  const { amount, email, externalReference } = req.body;
  let token = process.env.MP_ACCESS_TOKEN;
  try {
    const settingsFile = require("path").join(__dirname, "../models/settings.json");
    if (require("fs").existsSync(settingsFile)) {
      const s = JSON.parse(require("fs").readFileSync(settingsFile, "utf-8"));
      if (s.mpAccessToken) token = s.mpAccessToken;
    }
  } catch (e) { console.error("Erro ao ler settings.json", e); }

  // MODO DE TESTE: Se nao houver token, gera PIX ficticio
  if (!token || token.includes("seu_token") || token.includes("placeholder")) {
    console.log("Gerando PIX de TESTE (sem token Mercado Pago)");
    const fakePixCode = "00020126580014BR.GOV.BCB.PIX0136teste@Asstore.com.br5204000053039865802BR5919Asstore TESTE6006MANAUS62070503***6304ABCD";
    
    try {
      const qrCodeBase64 = await QRCode.toDataURL(fakePixCode);
      return res.json({
        order_id: "TEST_" + Date.now(),
        status: "pending",
        qr_code: fakePixCode,
        qr_code_base64: qrCodeBase64,
        is_test: true
      });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao gerar QR Code de teste" });
    }
  }

  // MODO REAL: Mercado Pago
  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const orderClient = new Order(client);

    const order = await orderClient.create({
      body: {
        type: "online",
        total_amount: String(Number(amount).toFixed(2)),
        external_reference: externalReference || ("pedido_" + Date.now()),
        processing_mode: "automatic",
        transactions: {
          payments: [{
            amount: String(Number(amount).toFixed(2)),
            payment_method: { id: "pix", type: "bank_transfer" },
          }],
        },
        payer: { email: email || "cliente@email.com" },
      },
      requestOptions: {
        idempotencyKey: "pix_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      },
    });

    const payment = order.transactions.payments[0];
    res.json({
      order_id: order.id,
      status: order.status,
      qr_code: payment.payment_method.qr_code,
      qr_code_base64: payment.payment_method.qr_code_base64,
      is_test: false
    });
  } catch (error) {
    console.error("Erro MP:", error);
    res.status(500).json({ error: "Falha ao gerar PIX no Mercado Pago" });
  }
});

module.exports = router;
