import { useEffect, useState } from 'react'
import SummaryCard from '../../components/admin/SummaryCard.jsx'
import TablePagination from '../../components/admin/TablePagination.jsx'
import UserFilters from '../../components/admin/UserFilters.jsx'
import UserTable from '../../components/admin/UserTable.jsx'
import { fetchAdminUsers } from '../../lib/admin'

const format = (value) => new Intl.NumberFormat('en-US').format(value)

const EMPTY_FILTERS = { search: '', role: '', plan: '', status: '' }

/** Quote a CSV field only when it contains something that would break the row. */
const csvCell = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * AdminUsersPage — "Admin / Pengguna" (design 10:62689).
 *
 * 1144px content grid: heading, four 274×64 summary cards, a 40px filter row,
 * then a 484px table (44px header + ten 44px rows) with its page controls below.
 * Every figure on the page comes from the users table, so there is no
 * sample-data note at the bottom — unlike the Overview, nothing here is
 * illustrative.
 */
export default function AdminUsersPage() {
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS }))
  const [sort, setSort] = useState({ column: 'created_at', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selected, setSelected] = useState(() => new Set())
  const [state, setState] = useState({ status: 'loading', data: null })
  const [reloadToken, setReloadToken] = useState(0)

  // Typing narrows the list once the admin pauses, rather than per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        current.search === searchInput ? current : { ...current, search: searchInput },
      )
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let alive = true

    // The previous page stays on screen until the next one arrives, so the
    // table does not collapse every time a filter changes.
    fetchAdminUsers({
      ...filters,
      sort: sort.column,
      direction: sort.direction,
      page,
      per_page: perPage,
    })
      .then((payload) => {
        if (!alive) return
        setState({ status: 'ready', data: payload })
        setSelected(new Set())
      })
      .catch(() => {
        if (alive) setState({ status: 'error', data: null })
      })

    return () => {
      alive = false
    }
  }, [filters, sort, page, perPage, reloadToken])

  const retry = () => {
    setState({ status: 'loading', data: null })
    setReloadToken((token) => token + 1)
  }

  const data = state.data

  if (state.status === 'error') {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-[420px] flex-col items-center rounded-[12px] border border-[#dad9d4] bg-white p-8 text-center">
          <p className="text-[15px] font-bold text-[#17191f]">Users unavailable</p>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#686b73]">
            We could not load the account list. Please try again.
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

  const { data: users, meta, summary } = data

  const changeFilter = (patch) => {
    setFilters((current) => ({ ...current, ...patch }))
    setPage(1)
  }

  const changeSort = (column) => {
    setSort((current) =>
      current.column === column
        ? { column, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: column === 'created_at' ? 'desc' : 'asc' },
    )
    setPage(1)
  }

  const changePerPage = (value) => {
    setPerPage(value)
    setPage(1)
  }

  /**
   * Selection is tracked here so the row boxes behave; the bulk action bar that
   * acts on them is a later pass (design 10:63789).
   */
  const toggleSelected = (id) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  /** Client-side CSV of the page on screen, matching the Overview's export. */
  const exportCsv = () => {
    const rows = [
      ['Name', 'Email', 'Role', 'Plan', 'Status', 'Joined'],
      ...users.map((user) => [
        user.name,
        user.email,
        user.role,
        user.plan,
        user.status,
        new Date(user.created_at).toISOString().slice(0, 10),
      ]),
    ]

    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `relearn-users-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page heading */}
      <div className="flex w-full flex-col gap-[6px]">
        <h1 className="text-[28px] leading-[1.5] font-bold text-[#17191f]">Users</h1>
        <p className="text-[12px] leading-[1.5] text-[#686b73]">
          Every account on the platform, with its role, plan and access status.
        </p>
      </div>

      {/* Account summary */}
      <div className="flex w-full items-start gap-4">
        <SummaryCard label="Total users" value={format(summary.total)} />
        <SummaryCard label="Active accounts" value={format(summary.active)} />
        <SummaryCard label="Suspended" value={format(summary.suspended)} />
        <SummaryCard label="Pro subscriptions" value={format(summary.pro)} />
      </div>

      <UserFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        value={{ role: filters.role, plan: filters.plan, status: filters.status }}
        onChange={changeFilter}
        onExport={exportCsv}
      />

      <div className="flex w-full flex-col gap-4">
        <UserTable
          users={users}
          sort={sort}
          onSort={changeSort}
          selected={selected}
          onToggle={toggleSelected}
        />
        <TablePagination
          meta={meta}
          perPage={perPage}
          onPerPageChange={changePerPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
