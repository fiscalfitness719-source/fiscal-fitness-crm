export const DEFAULT_SCOPE_WEBSITE = [
  'Custom website design tailored to your brand',
  'Mobile-responsive layout for all devices',
  'Up to 5 pages (Home, About, Services, Contact + 1)',
  'Contact / inquiry form with email notifications',
  'Basic on-page SEO setup (titles, meta descriptions, sitemap)',
  'Google Analytics integration',
  'Domain & hosting setup and launch',
  '30 days post-launch support',
]

export const DEFAULT_SCOPE_BOOKKEEPING = [
  'Initial chart of accounts setup',
  'Historical books cleanup (up to 3 months)',
  'Monthly bank & credit card reconciliation',
  'Accounts payable & receivable tracking',
  'Monthly profit & loss statement',
  'Monthly balance sheet',
  'Year-end summary report',
  'Ongoing email support for financial questions',
]

export const DEFAULT_TERMS =
  'Payment is due within 14 days of invoice. A 50% deposit is required before work begins. ' +
  'All deliverables remain the property of the client upon receipt of full payment. ' +
  'Changes beyond the agreed scope will be quoted and invoiced separately. ' +
  'This proposal is valid for 30 days from the date issued.'

export function defaultScopeForServiceType(serviceType: string): string[] {
  if (serviceType === 'website') return DEFAULT_SCOPE_WEBSITE
  if (serviceType === 'bookkeeping') return DEFAULT_SCOPE_BOOKKEEPING
  return [...DEFAULT_SCOPE_WEBSITE, ...DEFAULT_SCOPE_BOOKKEEPING]
}
