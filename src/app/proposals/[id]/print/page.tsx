import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { getDb } from '@/lib/db'
import { proposals, proposalItems, clients } from '@/lib/db/schema'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const FREQ_LABEL: Record<string, string> = {
  one_time: 'One-time',
  monthly: 'Monthly',
  annual: 'Annual',
}

export default async function ProposalPrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const db = getDb()

  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1)

  if (!proposal) notFound()

  const [client] = await db
    .select({ name: clients.name })
    .from(clients)
    .where(eq(clients.id, proposal.clientId))
    .limit(1)

  if (!client) notFound()

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, id))
    .orderBy(proposalItems.sortOrder)

  const scopeItems = items.filter((i) => i.section === 'scope')
  const pricingItems = items.filter((i) => i.section === 'pricing')

  const oneTimeTotal = pricingItems.filter(i => i.frequency === 'one_time' && i.amount).reduce((s, i) => s + Number(i.amount), 0)
  const monthlyTotal = pricingItems.filter(i => i.frequency === 'monthly' && i.amount).reduce((s, i) => s + Number(i.amount), 0)
  const annualTotal = pricingItems.filter(i => i.frequency === 'annual' && i.amount).reduce((s, i) => s + Number(i.amount), 0)

  const dateStr = new Date(proposal.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      <style>{`
        body { background: #fff !important; color: #1e293b; }
        .proposal-page { max-width: 760px; margin: 0 auto; padding: 48px 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; }
        .no-print { margin-bottom: 32px; display: flex; gap: 12px; }
        .prop-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 28px; }
        .prop-brand { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .prop-brand-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
        .prop-meta { text-align: right; font-size: 13px; color: #475569; }
        .prop-meta-label { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .prop-status { display: inline-block; margin-top: 8px; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-draft { background: #f1f5f9; color: #475569; }
        .status-sent { background: #dbeafe; color: #1d4ed8; }
        .status-accepted { background: #dcfce7; color: #15803d; }
        .prop-cover { background: #f8fafc; border-left: 3px solid #e2e8f0; padding: 14px 16px; border-radius: 0 6px 6px 0; margin-bottom: 32px; font-size: 14px; color: #334155; line-height: 1.6; }
        .prop-section { margin-bottom: 32px; }
        .prop-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
        .scope-item { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; font-size: 14px; color: #334155; line-height: 1.5; }
        .scope-check { color: #22c55e; font-size: 13px; flex-shrink: 0; margin-top: 2px; }
        .prop-table { width: 100%; border-collapse: collapse; }
        .prop-table th { text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
        .prop-table td { padding: 10px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .prop-table td.right { text-align: right; font-weight: 500; }
        .prop-totals { margin-top: 12px; padding: 12px 10px; background: #f8fafc; border-radius: 6px; }
        .prop-total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
        .prop-total-label { color: #64748b; }
        .prop-total-amount { font-weight: 700; color: #0f172a; }
        .prop-terms { font-size: 13px; color: #64748b; line-height: 1.7; white-space: pre-wrap; }
        .prop-sig { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .prop-sig-line { border-bottom: 1px solid #0f172a; margin-bottom: 6px; height: 36px; }
        .prop-sig-label { font-size: 11px; color: #94a3b8; }
        @media print {
          .no-print { display: none !important; }
          body { font-size: 13px; }
          .proposal-page { padding: 24px 32px; }
        }
      `}</style>

      <div className="proposal-page">
        <div className="no-print">
          <PrintButton />
          <Link
            href={`/proposals/${id}/edit`}
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', background: 'white', color: '#475569', border: '1px solid #e2e8f0' }}
          >
            ← Back to Editor
          </Link>
        </div>

        <div className="prop-header">
          <div>
            <div className="prop-brand">Fiscal Fitness</div>
            <div className="prop-brand-sub">Website &amp; Bookkeeping Services</div>
          </div>
          <div className="prop-meta">
            <div><span className="prop-meta-label">Prepared for</span><br /><strong>{client.name}</strong></div>
            <div style={{ marginTop: '8px' }}><span className="prop-meta-label">Date</span><br />{dateStr}</div>
            <div>
              <span className={`prop-status status-${proposal.status}`}>{proposal.status}</span>
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
          {proposal.title}
        </h1>

        {proposal.coverNote && (
          <div className="prop-cover">{proposal.coverNote}</div>
        )}

        {scopeItems.length > 0 && (
          <div className="prop-section">
            <div className="prop-section-title">Scope of Work</div>
            {scopeItems.map((item, i) => (
              <div key={i} className="scope-item">
                <span className="scope-check">✓</span>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        )}

        {pricingItems.length > 0 && (
          <div className="prop-section">
            <div className="prop-section-title">Investment</div>
            <table className="prop-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {pricingItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td className="right">
                      {item.amount ? `$${Number(item.amount).toLocaleString()}` : '—'}
                    </td>
                    <td className="right">{FREQ_LABEL[item.frequency ?? ''] ?? item.frequency ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(oneTimeTotal > 0 || monthlyTotal > 0 || annualTotal > 0) && (
              <div className="prop-totals">
                {oneTimeTotal > 0 && (
                  <div className="prop-total-row">
                    <span className="prop-total-label">One-time total</span>
                    <span className="prop-total-amount">${oneTimeTotal.toLocaleString()}</span>
                  </div>
                )}
                {monthlyTotal > 0 && (
                  <div className="prop-total-row">
                    <span className="prop-total-label">Monthly total</span>
                    <span className="prop-total-amount">${monthlyTotal.toLocaleString()}/mo</span>
                  </div>
                )}
                {annualTotal > 0 && (
                  <div className="prop-total-row">
                    <span className="prop-total-label">Annual total</span>
                    <span className="prop-total-amount">${annualTotal.toLocaleString()}/yr</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {proposal.termsText && (
          <div className="prop-section">
            <div className="prop-section-title">Terms & Conditions</div>
            <div className="prop-terms">{proposal.termsText}</div>
          </div>
        )}

        <div className="prop-sig">
          <div>
            <div className="prop-sig-line" />
            <div className="prop-sig-label">Client Signature &amp; Date</div>
          </div>
          <div>
            <div className="prop-sig-line" />
            <div className="prop-sig-label">Authorized Representative &amp; Date</div>
          </div>
        </div>
      </div>
    </>
  )
}
