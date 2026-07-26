'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface ClientFormData {
  name: string
  email: string
  phone: string
  serviceType: string
  contractValue: string
  startDate: string
}

interface ClientFormProps {
  initial?: Partial<ClientFormData> & { id?: number }
  mode: 'create' | 'edit'
}

export default function ClientForm({ initial, mode }: ClientFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<ClientFormData>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    serviceType: initial?.serviceType ?? 'website',
    contractValue: initial?.contractValue ?? '',
    startDate: initial?.startDate ?? '',
  })

  function update(field: keyof ClientFormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url =
        mode === 'create'
          ? '/api/clients'
          : `/api/clients/${initial!.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          phone: form.phone || null,
          serviceType: form.serviceType,
          contractValue: form.contractValue ? Number(form.contractValue) : null,
          startDate: form.startDate || null,
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Save failed')
        return
      }

      const client = await res.json()
      router.push(`/clients/${client.id}`)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const field = (
    label: string,
    name: keyof ClientFormData,
    type = 'text',
    required = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        required={required}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {field('Name', 'name', 'text', true)}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Service Type <span className="text-red-500">*</span>
        </label>
        <select
          value={form.serviceType}
          onChange={(e) => update('serviceType', e.target.value)}
          disabled={mode === 'edit'}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="website">Website</option>
          <option value="bookkeeping">Bookkeeping</option>
          <option value="both">Both</option>
        </select>
        {mode === 'edit' && (
          <p className="text-xs text-slate-400 mt-1">Service type cannot be changed after creation.</p>
        )}
      </div>

      {field('Email', 'email', 'email')}
      {field('Phone', 'phone', 'tel')}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contract Value ($/yr)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.contractValue}
          onChange={(e) => update('contractValue', e.target.value)}
          placeholder="0.00"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {field('Start Date', 'startDate', 'date')}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : mode === 'create' ? 'Create client' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
