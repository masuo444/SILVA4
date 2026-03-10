const PRODUCTS = {
  standard: {
    name: 'SILVA フィジカルゲーム コンプリートセット',
    description: 'ゲームカード18枚 + ルールカード2枚 / 11種類のユニークなキャラクター',
    amount: 1500,
  },
  masu: {
    name: 'SILVA 枡セット（ミニ枡付き）',
    description: 'ゲームカード18枚 + ルールカード2枚 + オリジナルミニ枡 / 特別パッケージ',
    amount: 2500,
  },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product } = req.body;

    if (!product || !PRODUCTS[product]) {
      return res.status(400).json({ error: 'Invalid product' });
    }

    const item = PRODUCTS[product];
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('line_items[0][price_data][currency]', 'jpy');
    params.append('line_items[0][price_data][product_data][name]', item.name);
    params.append('line_items[0][price_data][product_data][description]', item.description);
    params.append('line_items[0][price_data][unit_amount]', item.amount);
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'payment');
    params.append('shipping_address_collection[allowed_countries][]', 'JP');
    params.append('success_url', `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/#buy`);

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Stripe API error:', JSON.stringify(data));
      return res.status(response.status).json({
        error: 'Stripe error',
        detail: data.error?.message || 'Unknown error',
      });
    }

    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      detail: err.message,
    });
  }
};
