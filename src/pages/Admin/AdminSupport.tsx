import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Search, Loader2, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Ticket {
  _id: string
  name: string
  email: string
  type: string
  message: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
}

const statusConfig = {
  open:        { label: 'Open',        color: 'bg-red-100 text-red-600',     icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-600', icon: Clock },
  resolved:    { label: 'Resolved',    color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

const typeLabels: Record<string, string> = {
  account:     'Account & Login',
  appointment: 'Appointments',
  billing:     'Billing',
  technical:   'Technical Issue',
  other:       'Other',
}

export default function AdminSupport() {
  const [tickets,   setTickets]   = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState<string>('all')
  const [selected,  setSelected]  = useState<Ticket | null>(null)

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support')
      setTickets(res.data)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchTickets() }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/support/${id}/status`, { status })
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status: status as Ticket['status'] } : t))
      if (selected?._id === id) setSelected(prev => prev ? { ...prev, status: status as Ticket['status'] } : null)
    } catch (err) { console.error(err) }
  }

  const filtered = tickets.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    all:         tickets.length,
    open:        tickets.filter(t => t.status === 'open').length,
    'in-progress': tickets.filter(t => t.status === 'in-progress').length,
    resolved:    tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#065F46]" />
          Support Tickets
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage and respond to user support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'all',         label: 'Total',       color: 'text-gray-700',   bg: 'bg-white' },
          { key: 'open',        label: 'Open',        color: 'text-red-600',    bg: 'bg-red-50' },
          { key: 'in-progress', label: 'In Progress', color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { key: 'resolved',    label: 'Resolved',    color: 'text-green-700',  bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.key} className={`${s.bg} rounded-2xl p-4 shadow-sm`}>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{counts[s.key as keyof typeof counts]}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'in-progress', 'resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-[#065F46] text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-[#065F46]'
              }`}
            >
              {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading tickets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No tickets found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Type', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(ticket => {
                const cfg = statusConfig[ticket.status]
                const Icon = cfg.icon
                return (
                  <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-700">{ticket.name}</td>
                    <td className="px-5 py-4 text-gray-500">{ticket.email}</td>
                    <td className="px-5 py-4 text-gray-500">{typeLabels[ticket.type] || ticket.type}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelected(ticket)}
                        className="text-xs text-[#065F46] font-semibold hover:underline"
                      >
                        View
                      </button>
                      <select
                        value={ticket.status}
                        onChange={e => handleStatusChange(ticket._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#065F46]/30 text-gray-600"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selected.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {typeLabels[selected.type] || selected.type}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[selected.status].color}`}>
                {statusConfig[selected.status].label}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed mb-5">
              {selected.message}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {new Date(selected.createdAt).toLocaleString('en-GB')}
              </p>
              <div className="flex gap-2">
                {['open', 'in-progress', 'resolved'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selected._id, s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      selected.status === s
                        ? 'bg-[#065F46] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}