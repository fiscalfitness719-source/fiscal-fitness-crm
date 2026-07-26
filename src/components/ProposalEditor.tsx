'use client'

import { useState } from 'react'
import Link from 'next/link'
import { defaultScopeForServiceType, DEFAULT_TERMS } from '@/lib/proposal-defaults'

interface Item {
  section: 'scope' | 'pricing'
  description: string
  amount: string
  frequency: string
  sortOrder: number
}

interface ProposalData {
  id: number
  title: string
  status: string
  coverNote: string | null
  termsText: string | null
  items: Array<{
    section: string
    description: string
    amount: string | null
    frequency: string | null
    sortOrder: number
  }>
}

const FREQUENCIES = [
  { value: 'one_time', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
]

const STATUS_OPTIONS = ['draft', 'sent', 'accepted']
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
}

export default function ProposalEditor({
  proposal,
  serviceType,
  clientName,
  clientId,
}: {
  proposal: ProposalData
  serviceType: string
  clientName: string
  clientId: number
}) {
  const [title, setTitle] = useState(proposal.title)
  const [status, setStatus] = useState(proposal.status)
  const [coverNote, setCoverNote] = useState(proposal.coverNote ?? '')
  const [termsText, setTermsText] = useState(proposal.termsText ?? DEFAULT_TERMS)

  const initItems = (section: 'scope' | 'pricing'): Item[] =>
    proposal.items
      .filter((i) => i.section === section)
      .map((i) => ({
        section,
        description: i.description,
        amount: i.amount ?? '',
        frequency: i.frequency ?? 'one_time',
        sortOrder: i.sortOrder,
      }))

  const [scopeItems, setScopeItems] = useState<Item[]>(initItems('scope'))
  const [pricingItems, setPricingItems] = useState<Item[]>(initItems('pricing'))
  const [newScope, setNewScope] = useState('')
  const [newPricing, setNewPricing] = useState({ description: '', amount: '', frequency: 'one_time' })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  function updateScope(i: number, value: string) {
    setScopeItems((prev) => prev.map((item, idx) => idx === i ? { ...item, description: value } : item))
  }

  function removeScope(i: number) {
    setScopeItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addScope() {
    if (!newScope.trim()) return
    setScopeItems((prev) => [...prev, { section: 'scope', description: newScope.trim(), amount: '', frequency: '', sortOrder: prev.length }])
    setNewScope('')
  }

  function updatePricing(i: number, field: keyof Omit<Item, 'section' | 'sortOrder'>, value: string) {
    setPricingItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function removePricing(i: number) {
    setPricingItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addPricing() {
    if (!newPricing.description.trim()) return
    setPricingItems((prev) => [...prev, { section: 'pricing', description: newPricing.description.trim(), amount: newPricing.amount, frequency: newPricing.frequency, sortOrder: prev.length }])
    setNewPricing({ description: '', amount: '', frequency: 'one_time' })
  }

  function resetScopeToDefaults() {
    if (!confirm('Replace scope items with defaults?')) return
    const defaults = defaultScopeForServiceType(serviceType)
    setScopeItems(defaults.map((description, i) => ({ section: 'scope', description, amount: '', frequency: '', sortOrder: i })))
  }

  async function handleSave() {
    setSaveState('saving')
    const allItems = [
      ...scopeItems.map((item, i) => ({ ...item, sortOrder: i })),
      ...pricingItems.map((item, i) => ({ ...item, sortOrder: i })),
    ]
    await fetch(`/api/proposals/${proposal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status, coverNote, termsText, items: allItems }),
    })
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2000)
  }

  const oneTimeTotal = pricingItems.filter(i => i.frequency === 'one_time' && i.amount).reduce((sum, i) => sum + Number(i.amount), 0)
  const monthlyTotal = pricingItems.filter(i => i.frequency === 'monthly' && i.amount).reduce((sum, i) => sum + Number(i.amount), 0)
  const annualTotal = pricingItems.filter(i => i.frequency === 'annual' && i.amount).reduce((sum, i) => sum + Number(i.amount), 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/clients/${clientId}`} className="text-sm text-slate-400 hover:text-slate-600">
          ← {clientName}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-500">Proposals</span>
      </div>

      {/* Title + status + actions bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-xl font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-slate-500 focus:outline-none pb-0.5 bg-transparent"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 ${STATUS_COLORS[status]}`}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save'}
            </button>
            <Link
              href={`/proposals/${proposal.id}/print`}
              target="_blank"
              className="text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              View / Print
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cover Note */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Cover Note <span className="text-slate-400 font-normal">(optional)</span></h2>
          <textarea
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Add a personal intro or note to the client…"
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </section>

        {/* Scope of Work */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Scope of Work</h2>
            <button onClick={resetScopeToDefaults} className="text-xs text-slate-400 hover:text-slate-600 underline">
              Reset to defaults
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {scopeItems.length === 0 && (
              <p className="text-sm text-slate-400 italic">No scope items yet.</p>
            )}
            {scopeItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-300 text-sm">•</span>
                <input
                  value={item.description}
                  onChange={(e) => updateScope(i, e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button onClick={() => removeScope(i)} className="text-slate-300 hover:text-red-400 text-sm px-1">✕</button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={newScope}
              onChange={(e) => setNewScope(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addScope())}
              placeholder="Add scope item…"
              className="flex-1 text-sm border border-dashed border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={addScope}
              disabled={!newScope.trim()}
              className="text-sm text-slate-600 border border-slate-200 hover:border-slate-400 px-3 py-1 rounded transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Investment</h2>

          {pricingItems.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-slate-400 font-medium px-1">
                <span>Description</span><span>Amount ($)</span><span>Frequency</span><span></span>
              </div>
              {pricingItems.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                  <input
                    value={item.description}
                    onChange={(e) => updatePricing(i, 'description', e.target.value)}
                    className="text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => updatePricing(i, 'amount', e.target.value)}
                    placeholder="0.00"
                    className="w-24 text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <select
                    value={item.frequency}
                    onChange={(e) => updatePricing(i, 'frequency', e.target.value)}
                    className="text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <button onClick={() => removePricing(i)} className="text-slate-300 hover:text-red-400 text-sm px-1">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add pricing row */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center mb-4">
            <input
              value={newPricing.description}
              onChange={(e) => setNewPricing((p) => ({ ...p, description: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPricing())}
              placeholder="Add line item…"
              className="text-sm border border-dashed border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={newPricing.amount}
              onChange={(e) => setNewPricing((p) => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className="w-24 text-sm border border-dashed border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <select
              value={newPricing.frequency}
              onChange={(e) => setNewPricing((p) => ({ ...p, frequency: e.target.value }))}
              className="text-sm border border-dashed border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <button
              onClick={addPricing}
              disabled={!newPricing.description.trim()}
              className="text-sm text-slate-600 border border-slate-200 hover:border-slate-400 px-3 py-1 rounded transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {/* Totals */}
          {(oneTimeTotal > 0 || monthlyTotal > 0 || annualTotal > 0) && (
            <div className="border-t border-slate-100 pt-3 space-y-1">
              {oneTimeTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">One-time total</span>
                  <span className="font-semibold text-slate-800">${oneTimeTotal.toLocaleString()}</span>
                </div>
              )}
              {monthlyTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Monthly total</span>
                  <span className="font-semibold text-slate-800">${monthlyTotal.toLocaleString()}/mo</span>
                </div>
              )}
              {annualTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Annual total</span>
                  <span className="font-semibold text-slate-800">${annualTotal.toLocaleString()}/yr</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Terms */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Terms & Conditions</h2>
            <button
              onClick={() => setTermsText(DEFAULT_TERMS)}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Reset to default
            </button>
          </div>
          <textarea
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
            rows={5}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </section>

        <div className="flex justify-end gap-3 pb-8">
          <Link
            href={`/proposals/${proposal.id}/print`}
            target="_blank"
            className="text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-colors"
          >
            View / Print
          </Link>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved ✓' : 'Save proposal'}
          </button>
        </div>
      </div>
    </div>
  )
}
