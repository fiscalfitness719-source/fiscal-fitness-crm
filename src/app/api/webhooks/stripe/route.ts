import Stripe from 'stripe'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword, generateTempPassword } from '@/lib/auth'

export const runtime = 'edge'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-07-29.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email

    if (!email) {
      console.error('No email on completed checkout session', session.id)
      return Response.json({ received: true })
    }

    const tempPassword = generateTempPassword()
    const passwordHash = await hashPassword(tempPassword)
    const username = email.toLowerCase().replace(/[^a-z0-9]/g, '_')

    const db = getDb()
    try {
      await db.insert(users).values({
        username,
        passwordHash,
        email: email.toLowerCase(),
        role: 'member',
      })
    } catch (err: unknown) {
      // Duplicate email = already a member, skip silently
      if (err instanceof Error && err.message.includes('unique')) {
        return Response.json({ received: true })
      }
      throw err
    }

    // Send welcome email with temp password
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to the 4-Stage Business Engine — Your Login',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <h1 style="color: #10b981;">Welcome to Fiscal Fitness!</h1>
            <p>You're in. Here are your login credentials for the 4-Stage Business Engine curriculum:</p>
            <p style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
              <strong>Login page:</strong> <a href="${process.env.PUBLIC_CRM_URL || 'https://fiscal-fitness-crm-7nk.pages.dev'}/members/login">${process.env.PUBLIC_CRM_URL || 'https://fiscal-fitness-crm-7nk.pages.dev'}/members/login</a><br/>
              <strong>Email:</strong> ${email}<br/>
              <strong>Password:</strong> ${tempPassword}
            </p>
            <p>Save this email — this is your only copy of the password.</p>
            <p style="color: #6b7280; font-size: 14px;">Questions? Reply to this email.</p>
          </div>
        `,
      }),
    })
  }

  return Response.json({ received: true })
}
