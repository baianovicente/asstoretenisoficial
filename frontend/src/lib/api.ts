const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    return res.json();
  } catch (err) {
    console.error('Erro API:', err);
    return [];
  }
}

export async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro ao buscar produto');
    return res.json();
  } catch (err) {
    console.error('Erro API:', err);
    return null;
  }
}

export async function createOrder(order: any) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return res.json();
}

export async function generatePix(amount: number) {
  const res = await fetch(`${API_URL}/api/payments/pix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}
