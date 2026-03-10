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
  if (req.method === 'GET') {
    const key = process.env.STRIPE_SECRET_KEY || '';
    // Check for non-ASCII characters
    const nonAscii = [];
    for (let i = 0; i < key.length; i++) {
      if (key.charCodeAt(i) > 127) {
        nonAscii.push({ index: i, code: key.charCodeAt(i), char: key[i] });
      }
    }
    return res.status(200).json({
      length: key.length,
      prefix: key.substring(0, 15),
      suffix: key.substring(key.length - 5),
      nonAscii,
    });
  }

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

    const body = [
      'payment_method_types[]=card',
      'line_items[0][price_data][currency]=jpy',
      `line_items[0][price_data][product_data][name]=${encodeURIComponent(item.name)}`,
      `line_items[0][price_data][product_data][description]=${encodeURIComponent(item.description)}`,
      `line_items[0][price_data][unit_amount]=${item.amount}`,
      'line_items[0][quantity]=1',
      'mode=payment',
      'shipping_address_collection[allowed_countries][]=JP',
      `success_url=${encodeURIComponent(`${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`)}`,
      `cancel_url=${encodeURIComponent(`${origin}/#buy`)}`,
    ].join('&');

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
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
