import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Flag,
  LoaderCircle,
  Search,
  Sparkles,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react'
import KpiCard from '../../components/admin/KpiCard.jsx'
import StatusBadge from '../../components/admin/StatusBadge.jsx'
import TrendChart from '../../components/admin/TrendChart.jsx'
import { fetchAdminOverview } from '../../lib/admin'

const format = (value) => new Intl.NumberFormat('en-US').format(value)

/**
 * Illustrative content: revenue and AI usage have no backing table yet, so the
 * values below are the design's own sample figures (design 10:62423). The page
 * footer says so. Accounts and material counts are live.
 */
const SAMPLE_REVENUE = [8, 10, 12, 16, 20, 24]
const SAMPLE_REPORTS = 12
const SAMPLE_TRANSACTIONS = [
  {
    id: 1,
    name: 'Nadia Putri',
    detail: 'Community · Data Sains ID',
    amount: 'Rp75,000',
    tone: 'paid',
    status: 'Paid',
  },
  {
    id: 2,
    name: 'Fajar Ramadhan',
    detail: 'Pro subscription',
    amount: 'Rp50,000',
    tone: 'paid',
    status: 'Paid',
  },
  {
    id: 3,
    name: 'Bima Prakoso',
    detail: 'Community · Data Sains ID',
    amount: 'Rp75,000',
    tone: 'pending',
    status: 'Pending',
  },
  {
    id: 4,
    name: 'Siti Aisyah',
    detail: 'Community · UI/UX Nusantara',
    amount: 'Rp75,000',
    tone: 'failed',
    status: 'Failed',
  },
]

const AI_SERIES = [
  { label: 'Learning paths', value: '7.2M · 60%', width: '60%', bar: 'bg-[#0033ff]' },
  { label: 'Quiz generation', value: '4.8M · 40%', width: '40%', bar: 'bg-[#b9c5ff]' },
]

/**
 * AdminOverviewPage — "Admin / Ringkasan" (design 10:62423).
 *
 * 1144px content grid at 1440: heading, period controls, five KPI cards, three
 * analytics cards (360/456/296) and a two-card operational row (700/428).
 * Widths are ratio-based so the proportions hold as the viewport widens.
 */
export default function AdminOverviewPage() {
  const [state, setState] = useState({ status: 'loading', data: null })
  const [reloadToken, setReloadToken] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let alive = true
    fetchAdminOverview()
      .then((payload) => {
        if (alive) setState({ status: 'ready', data: payload })
      })
      .catch(() => {
        if (alive) setState({ status: 'error', data: null })
      })
    return () => {
      alive = false
    }
  }, [reloadToken])

  const retry = () => {
    setState({ status: 'loading', data: null })
    setReloadToken((token) => token + 1)
  }

  const data = state.data

  const monthRange = useMemo(() => {
    const now = new Date()
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const month = now.toLocaleDateString('en-US', { month: 'long' })
    return `1–${days} ${month} ${now.getFullYear()}`
  }, [])

  if (state.status === 'error') {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-[420px] flex-col items-center rounded-[12px] border border-[#dad9d4] bg-white p-8 text-center">
          <p className="text-[15px] font-bold text-[#17191f]">Dashboard unavailable</p>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#686b73]">
            We could not load the dashboard. Please try again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex h-10 items-center justify-center rounded-[6px] bg-[#0033ff] px-5 text-[12px] font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[#dde3ff] border-t-[#0033ff]" />
      </div>
    )
  }

  const growth = data.user_growth
  const firstMonth = growth[0]
  const lastMonth = growth[growth.length - 1]
  const growthRange = `${firstMonth.label}–${lastMonth.label} ${lastMonth.month.slice(0, 4)}`
  const growthPoints = growth.map((point) => ({ ...point, value: point.total }))
  const revenuePoints = growth.map((point, index) => ({
    ...point,
    value: SAMPLE_REVENUE[index] ?? 0,
  }))

  const generatedAt = new Date(data.generated_at)
  const monthShort = generatedAt.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'Asia/Jakarta',
  })
  const updateStamp = generatedAt.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })

  const failedMaterials = data.materials.failed
  const processingMaterials = data.materials.processing

  const attentionItems = [
    {
      id: 'failed',
      icon: CircleAlert,
      title: `${format(failedMaterials)} material${failedMaterials === 1 ? '' : 's'} failed to process`,
      detail: 'Review the upload and processing logs.',
    },
    {
      id: 'processing',
      icon: LoaderCircle,
      title: `${format(processingMaterials)} material${processingMaterials === 1 ? '' : 's'} processing`,
      detail: 'Processing queue is still running.',
    },
    {
      id: 'reports',
      icon: Flag,
      title: `${format(SAMPLE_REPORTS)} content reports`,
      detail: '3 high priority in the moderation queue.',
    },
  ]

  const needle = query.trim().toLowerCase()
  const visibleTransactions = needle
    ? SAMPLE_TRANSACTIONS.filter((row) =>
        `${row.name} ${row.detail} ${row.amount} ${row.status}`.toLowerCase().includes(needle),
      )
    : SAMPLE_TRANSACTIONS
  const visibleAttention = needle
    ? attentionItems.filter((item) =>
        `${item.title} ${item.detail}`.toLowerCase().includes(needle),
      )
    : attentionItems

  /** Client-side CSV of the figures currently on screen. */
  const exportSummary = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total users', data.users.total],
      ['Free accounts', data.users.free],
      ['Pro accounts', data.users.pro],
      ['New accounts this month', data.users.new_this_month],
      ['Month-over-month growth', `${data.users.growth_percent}%`],
      ['Materials', data.materials.total],
      ['Materials processing', data.materials.processing],
      ['Materials failed', data.materials.failed],
      [],
      ['Month', 'Accounts'],
      ...growth.map((point) => [point.month, point.total]),
    ]

    const csv = rows.map((row) => row.join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `relearn-overview-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page heading */}
      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <h1 className="text-[28px] leading-[1.5] font-bold text-[#17191f]">Overview</h1>
          <p className="text-[12px] leading-[1.5] text-[#686b73]">
            A view of activity, revenue and what needs following up.
          </p>
        </div>
        <button
          type="button"
          onClick={exportSummary}
          className="flex h-10 w-[184px] shrink-0 items-center justify-center gap-1 rounded-[6px] border border-[#0033ff] bg-[#0033ff] text-[12px] font-semibold text-white"
        >
          <ArrowDown size={14} aria-hidden="true" />
          Export summary
        </button>
      </div>

      {/* Period controls */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-2">
          <div className="flex h-10 shrink-0 items-center gap-2 rounded-[6px] border border-[#dad9d4] bg-white px-3">
            <ChevronDown size={16} className="shrink-0 text-[#686b73]" aria-hidden="true" />
            <p className="text-[11px] leading-[1.5] whitespace-nowrap text-[#686b73]">
              {monthRange}
            </p>
          </div>
          <div className="flex h-10 w-[185px] shrink-0 items-center gap-2 rounded-[6px] border border-[#dad9d4] bg-white px-3">
            <Search size={16} className="shrink-0 text-[#686b73]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search metrics or activity"
              placeholder="Search metrics or activity"
              className="w-full min-w-0 border-0 bg-transparent text-[11px] leading-[1.5] text-[#17191f] outline-none placeholder:text-[#686b73]"
            />
          </div>
        </div>
        <p className="shrink-0 text-[11px] leading-[1.5] whitespace-nowrap text-[#686b73]">
          Updated {updateStamp} WIB
        </p>
      </div>

      {/* KPI overview */}
      <div className="flex w-full items-start gap-4">
        <KpiCard
          label="Total users"
          value={format(data.users.total)}
          detail={`Free ${format(data.users.free)} · Pro ${format(data.users.pro)}`}
          icon={Users}
        />
        <KpiCard
          label="Active communities"
          value="48"
          detail="38 free · 10 paid"
          icon={UsersRound}
        />
        <KpiCard
          label={`Gross revenue · ${monthShort}`}
          value="Rp24M"
          detail="Pro Rp12M · Communities Rp12M"
          icon={Wallet}
        />
        <KpiCard
          label={`AI tokens · ${monthShort}`}
          value="12 million"
          detail="Est. cost Rp360,000"
          icon={Sparkles}
        />
        <KpiCard
          label="Pending reports"
          value={format(SAMPLE_REPORTS)}
          detail="3 high priority · needs review"
          icon={Flag}
        />
      </div>

      {/* Analytics */}
      <div className="grid w-full grid-cols-[360fr_456fr_296fr] items-start gap-4">
        <section className="flex h-[270px] min-w-0 flex-col gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-5">
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-[16px] leading-[1.5] font-bold text-[#17191f]">User growth</h2>
            <p className="text-[11px] leading-[1.5] text-[#686b73]">
              Total accounts · {growthRange}
            </p>
          </div>
          <div className="flex w-full items-start justify-between text-[11px] leading-[1.5] whitespace-nowrap">
            <p className="text-[#217353]">
              +{format(data.users.new_this_month)} accounts this month
            </p>
            <p className="text-[#686b73]">
              {data.users.growth_percent >= 0 ? '+' : ''}
              {data.users.growth_percent.toFixed(1)}%
            </p>
          </div>
          <TrendChart points={growthPoints} />
        </section>

        <section className="flex h-[270px] min-w-0 flex-col gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-5">
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-[16px] leading-[1.5] font-bold text-[#17191f]">
              Monthly revenue
            </h2>
            <p className="text-[11px] leading-[1.5] text-[#686b73]">
              Gross settled transactions · in million Rupiah
            </p>
          </div>
          <TrendChart points={revenuePoints} />
          <div className="flex w-full items-start gap-3 leading-[1.5] whitespace-nowrap">
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="text-[9px] text-[#686b73]">Commission</p>
              <p className="text-[11px] font-bold text-[#17191f]">Rp2.4M</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="text-[9px] text-[#686b73]">Owners</p>
              <p className="text-[11px] font-bold text-[#17191f]">Rp9.6M</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="text-[9px] text-[#686b73]">Platform total</p>
              <p className="text-[11px] font-bold text-[#17191f]">Rp14.4M</p>
            </div>
          </div>
        </section>

        <section className="flex h-[270px] min-w-0 flex-col gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-5">
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-[16px] leading-[1.5] font-bold text-[#17191f]">AI usage</h2>
            <p className="text-[11px] leading-[1.5] text-[#686b73]">
              Tokens used · {generatedAt.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}
            </p>
          </div>
          <div className="flex w-full flex-col gap-4">
            {AI_SERIES.map((series) => (
              <div key={series.label} className="flex w-full flex-col gap-2">
                <div className="flex w-full items-start justify-between text-[11px] leading-[1.5] whitespace-nowrap">
                  <p className="text-[#17191f]">{series.label}</p>
                  <p className="text-[#686b73]">{series.value}</p>
                </div>
                <div className="flex h-2 w-full items-start overflow-hidden rounded-[4px] bg-[#f2f1ec]">
                  <div className={`h-2 rounded-[4px] ${series.bar}`} style={{ width: series.width }} />
                </div>
              </div>
            ))}
          </div>
          <p className="w-full text-[10px] leading-[1.5] text-[#686b73]">
            Rp30,000 / million tokens · estimate, not an invoice.
          </p>
        </section>
      </div>

      {/* Operational summary */}
      <div className="grid w-full grid-cols-[700fr_428fr] items-start gap-4">
        <section className="flex h-[224px] min-w-0 flex-col gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-5">
          <h2 className="text-[16px] leading-[1.5] font-bold text-[#17191f]">Recent transactions</h2>
          <div className="flex w-full flex-col">
            {visibleTransactions.map((row) => (
              <div key={row.id} className="flex h-8 w-full items-center gap-3">
                <p className="w-[138px] shrink-0 text-[11px] leading-[1.5] text-[#17191f]">
                  {row.name}
                </p>
                <p className="min-w-0 flex-1 text-[10px] leading-[1.5] text-[#686b73]">
                  {row.detail}
                </p>
                <p className="w-[88px] shrink-0 text-[11px] leading-[1.5] text-[#17191f]">
                  {row.amount}
                </p>
                <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
              </div>
            ))}
            {visibleTransactions.length === 0 && (
              <p className="py-4 text-[11px] leading-[1.5] text-[#686b73]">
                No transactions match “{query}”.
              </p>
            )}
          </div>
        </section>

        <section className="flex h-[224px] min-w-0 flex-col gap-4 overflow-hidden rounded-[12px] border border-[#dad9d4] bg-white p-5">
          <h2 className="text-[16px] leading-[1.5] font-bold text-[#17191f]">Needs attention</h2>
          <div className="flex w-full flex-col gap-[16px]">
            {visibleAttention.map((item) => {
              const ItemIcon = item.icon
              return (
                <div key={item.id} className="flex w-full items-center gap-3">
                  <ItemIcon
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0 text-[#17191f]"
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-[1.5]">
                    <p className="w-full text-[11px] font-bold text-[#17191f]">{item.title}</p>
                    <p className="w-full text-[9px] text-[#686b73]">{item.detail}</p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-[#686b73]"
                    aria-hidden="true"
                  />
                </div>
              )
            })}
            {visibleAttention.length === 0 && (
              <p className="text-[11px] leading-[1.5] text-[#686b73]">
                Nothing matches “{query}”.
              </p>
            )}
          </div>
        </section>
      </div>

      <p className="w-full text-[10px] leading-[1.5] text-[#686b73]">
        Accounts and material counts are live · revenue, token usage and reports are sample data ·
        updated {updateStamp} WIB.
      </p>
    </div>
  )
}
