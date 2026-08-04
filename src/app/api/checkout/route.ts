import Stripe from 'stripe'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-07-29.dahlia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const websiteUrl = process.env.WEBSITE_URL || 'https://fiscalfitness.co'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${websiteUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${websiteUrl}/checkout-cancel`,
    })

    return Response.redirect(session.url!, 303)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ error: message }, { status: 500 })
  }
}
