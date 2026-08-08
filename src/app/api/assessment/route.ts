import { Resend } from 'resend'

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
    const {
      firstName, email,
      overallScore, attractScore, closeScore, serveScore, advocateScore,
      systemsScore, aiReadiness, biggestConstraint, strongestStage,
      move1, move2, move3,
    } = body

    if (!firstName || !email) {
      return Response.json({ success: false, error: 'firstName and email are required' }, { status: 400, headers: CORS })
    }

    const stageLabel: Record<string, string> = {
      attract: 'Attract', close: 'Close', serve: 'Serve', advocate: 'Advocate',
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Notification email to Cody
    await resend.emails.send({
      from: 'Fiscal Fitness <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `New Assessment: ${firstName} (${email}) — ${overallScore}/100`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B1F3A;">New Business Readiness Assessment</h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Name</td><td style="padding:8px;">${firstName}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Overall Score</td><td style="padding:8px;font-size:20px;font-weight:bold;color:#00C47A;">${overallScore}/100</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Attract</td><td style="padding:8px;">${attractScore}/100</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Close</td><td style="padding:8px;">${closeScore}/100</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Serve</td><td style="padding:8px;">${serveScore}/100</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Advocate</td><td style="padding:8px;">${advocateScore}/100</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Systems Score</td><td style="padding:8px;">${systemsScore}/100</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#0B1F3A;">AI Readiness</td><td style="padding:8px;">${aiReadiness}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#0B1F3A;">Strongest Stage</td><td style="padding:8px;">${stageLabel[strongestStage] ?? strongestStage}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#F97316;">Biggest Constraint</td><td style="padding:8px;font-weight:bold;">${stageLabel[biggestConstraint] ?? biggestConstraint}</td></tr>
          </table>
          <h3 style="color:#0B1F3A;">Their Next 3 Moves</h3>
          <ol style="color:#555;line-height:1.7;">
            <li style="margin-bottom:8px;">${move1}</li>
            <li style="margin-bottom:8px;">${move2}</li>
            <li style="margin-bottom:8px;">${move3}</li>
          </ol>
        </div>
      `,
    })

    // Results email to visitor
    await resend.emails.send({
      from: 'Fiscal Fitness <onboarding@resend.dev>',
      replyTo: process.env.NOTIFICATION_EMAIL!,
      to: email,
      subject: `Your Fiscal Fitness Business Readiness Results — ${overallScore}/100`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0B1F3A;">
          <div style="background:#0B1F3A;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
            <p style="color:#00C47A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Business Readiness Assessment</p>
            <h1 style="color:white;font-size:28px;margin:0 0 8px;">Hi ${firstName} — here are your results.</h1>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">Fiscal Fitness · fiscalfitness.com</p>
          </div>

          <div style="background:#f9f9f9;padding:32px 24px;text-align:center;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">
            <p style="color:#555;font-size:13px;margin:0 0 8px;">Your Overall Business Readiness Score</p>
            <div style="font-size:72px;font-weight:800;color:#0B1F3A;line-height:1;">${overallScore}</div>
            <div style="color:#00C47A;font-size:18px;font-weight:700;">/100</div>
          </div>

          <div style="background:white;padding:32px 24px;border:1px solid #e5e5e5;">
            <h2 style="font-size:18px;margin:0 0 20px;">Your Business Engine Breakdown</h2>
            <table style="width:100%;border-collapse:collapse;">
              ${[
                ['Attract', attractScore],
                ['Close', closeScore],
                ['Serve', serveScore],
                ['Advocate', advocateScore],
              ].map(([label, score]) => `
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 0;font-weight:600;width:100px;">${label}</td>
                  <td style="padding:12px 0;">
                    <div style="background:#e5e5e5;border-radius:4px;height:8px;overflow:hidden;">
                      <div style="background:#00C47A;height:8px;width:${score}%;border-radius:4px;"></div>
                    </div>
                  </td>
                  <td style="padding:12px 0 12px 12px;font-weight:700;color:#0B1F3A;text-align:right;width:50px;">${score}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div style="background:white;padding:0 24px 24px;border:1px solid #e5e5e5;border-top:none;">
            <div style="display:flex;gap:16px;flex-wrap:wrap;">
              <div style="flex:1;min-width:220px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;">
                <p style="color:#16a34a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Strongest Stage</p>
                <p style="font-weight:700;font-size:20px;margin:0 0 8px;">${stageLabel[strongestStage] ?? strongestStage}</p>
              </div>
              <div style="flex:1;min-width:220px;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px;">
                <p style="color:#ea580c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Biggest Constraint</p>
                <p style="font-weight:700;font-size:20px;margin:0 0 8px;">${stageLabel[biggestConstraint] ?? biggestConstraint}</p>
              </div>
            </div>
          </div>

          <div style="background:white;padding:0 24px 24px;border:1px solid #e5e5e5;border-top:none;">
            <div style="background:#f9fafb;border-radius:12px;padding:20px;">
              <p style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">AI Readiness</p>
              <p style="font-weight:700;font-size:18px;color:#0B1F3A;margin:0 0 6px;">${aiReadiness}</p>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">Systems score: ${systemsScore}/100</p>
            </div>
          </div>

          <div style="background:white;padding:0 24px 32px;border:1px solid #e5e5e5;border-top:none;">
            <h2 style="font-size:18px;margin:0 0 8px;">Your Next 3 Moves</h2>
            <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">Based on your biggest constraint: <strong>${stageLabel[biggestConstraint] ?? biggestConstraint}</strong></p>
            <ol style="margin:0;padding:0 0 0 20px;color:#374151;line-height:1.7;">
              <li style="margin-bottom:12px;">${move1}</li>
              <li style="margin-bottom:12px;">${move2}</li>
              <li style="margin-bottom:12px;">${move3}</li>
            </ol>
          </div>

          <div style="background:#0B1F3A;padding:32px 24px;border-radius:0 0 12px 12px;text-align:center;">
            <p style="color:#00C47A;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Ready to Fix the Gaps?</p>
            <p style="color:white;font-size:18px;font-weight:700;margin:0 0 8px;">The 4-Stage Business Engine</p>
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 24px;">A structured curriculum that builds every system your assessment identified as a gap.</p>
            <a href="https://fiscalfitness.com/the-4-stage-engine" style="background:#00C47A;color:#0B1F3A;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;display:inline-block;">Explore the 4-Stage Engine →</a>
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:24px 0 0;">
              Questions? Reply to this email — it reaches Cody directly.<br/>
              <a href="https://tidycal.com/fiscalfitness719/15-minute-meeting" style="color:#00C47A;">Or book a free 15-minute call →</a>
            </p>
          </div>
        </div>
      `,
    })

    return Response.json({ success: true }, { headers: CORS })
  } catch (err) {
    console.error('Assessment endpoint error:', err)
    return Response.json({ success: false, error: 'Server error' }, { status: 500, headers: CORS })
  }
}
