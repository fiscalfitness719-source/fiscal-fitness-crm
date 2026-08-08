import { asc, eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { getDb } from '@/lib/db'
import { clients, clientTasks, stageHistory, checklistTemplates } from '@/lib/db/schema'

export const runtime = 'edge'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-lead-secret',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-lead-secret')
    if (!secret || secret !== process.env.LEAD_API_SECRET) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: CORS })
    }

    const body = await request.json()
    const { firstName, lastName, email, businessName, industry, serviceInterest, message } = body

    if (!firstName || !lastName || !email) {
      return Response.json(
        { success: false, error: 'firstName, lastName, and email are required' },
        { status: 400, headers: CORS }
      )
    }

    const serviceTypeMap: Record<string, string> = {
      'Bookkeeping': 'bookkeeping',
      'Business Consulting': 'website',
      'The 4-Stage Business Engine': 'website',
      "Not sure yet — let's talk": 'website',
    }
    const serviceType = serviceTypeMap[serviceInterest] ?? 'website'

    const websiteStage = serviceType === 'website' || serviceType === 'both' ? '1' : null
    const bookkeepingStage = serviceType === 'bookkeeping' || serviceType === 'both' ? '1' : null

    const db = getDb()
    const [client] = await db
      .insert(clients)
      .values({
        name: `${firstName} ${lastName}`,
        email: email || null,
        emailNotObtained: false,
        phone: null,
        serviceType,
        websiteStage,
        bookkeepingStage,
        contractValue: null,
        startDate: null,
      })
      .returning()

    const templates = await db
      .select()
      .from(checklistTemplates)
      .where(eq(checklistTemplates.stageCode, '1'))
      .orderBy(asc(checklistTemplates.sortOrder))

    if (templates.length > 0) {
      await db.insert(clientTasks).values(
        templates.map((t) => ({
          clientId: client.id,
          stageCode: '1',
          taskText: t.taskText,
        }))
      )
    }

    const tracks: { serviceTrack: string; toStage: string }[] = []
    if (websiteStage) tracks.push({ serviceTrack: 'website', toStage: '1' })
    if (bookkeepingStage) tracks.push({ serviceTrack: 'bookkeeping', toStage: '1' })

    if (tracks.length > 0) {
      await db.insert(stageHistory).values(
        tracks.map((t) => ({
          clientId: client.id,
          serviceTrack: t.serviceTrack,
          fromStage: null,
          toStage: t.toStage,
        }))
      )
    }

    const appUrl = new URL(request.url).origin
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Fiscal Fitness <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Lead: ${firstName} ${lastName}`,
      html: `
        <h2>New lead from the website</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Business:</strong> ${businessName || 'Not provided'}</p>
        <p><strong>Industry:</strong> ${industry || 'Not provided'}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #00C47A;margin:0;padding:0 1em;color:#555">${message || 'No message provided'}</blockquote>
        <br/>
        <p><a href="${appUrl}/clients/${client.id}" style="background:#00C47A;color:#0A1628;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">View in CRM →</a></p>
      `,
    })

    return Response.json({ success: true, clientId: client.id }, { headers: CORS })
  } catch (err) {
    console.error(err)
    return Response.json({ success: false, error: 'Server error' }, { status: 500, headers: CORS })
  }
}
