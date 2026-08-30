import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProduct } from '@/lib/products'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  try {
    const body = await request.json()
    const product = getProduct(String(body.productId))
    const quantity = Number(body.quantity)

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
      return NextResponse.json({ error: 'Invalid product or quantity.' }, { status: 400 })
    }

    const origin = request.headers.get('origin') ?? 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: product.name, description: product.edition },
            unit_amount: product.priceInCents,
          },
          quantity,
        }],
        customer_creation: 'always',
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancelled#checkout`,
        billing_address_collection: 'required',
      },
      { idempotencyKey: `aether-${product.id}-${quantity}-${crypto.randomUUID()}` },
    )

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 })
  }
}
