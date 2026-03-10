const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  timeout: 20000,
  maxNetworkRetries: 3,
});

const PRODUCTS = {
  standard: {
    name: 'SILVA フィジカルゲーム コンプリートセット',
    description: 'ゲームカード18枚 + ルールカード2枚 / 11種類のユニークなキャラクター',
    amount: 1500,
    image: 'images/11.png',
  },
  masu: {
    name: 'SILVA 枡セット（ミニ枡付き）',
    description: 'ゲームカード18枚 + ルールカード2枚 + オリジナルミニ枡 / 特別パッケージ',
    amount: 2500,
    image: 'images/11.png',
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#buy`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({
      error: 'Failed to create checkout session',
      detail: err.message,
      hasKey: !!process.env.STRIPE_SECRET_KEY,
    });
  }
};
