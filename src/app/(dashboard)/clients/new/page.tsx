import ClientForm from '@/components/ClientForm'

export const runtime = 'edge'

export default function NewClientPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">New Client</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new client to the pipeline.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ClientForm mode="create" />
      </div>
    </div>
  )
}
