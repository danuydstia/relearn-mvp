import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import SubscriptionBadge from '../ui/SubscriptionBadge.jsx'

/**
 * UserTable — the account list (design 10:62689).
 *
 * Column widths are the design's own (32/426/120/80/140/128/162/24) with one
 * change: the AI quota column is 162 of those, and it is not part of this pass,
 * so its width is folded into the identity column. Ratio-based so the
 * proportions hold as the viewport widens; the kebab column stays a fixed 24px
 * because its icon does not shrink.
 */
const GRID = 'grid grid-cols-[32fr_588fr_120fr_80fr_140fr_128fr_24px] items-center'

const ROLE_LABELS = {
  student: 'Student',
  admin: 'Admin',
}

const STATUS = {
  active: { label: 'Active', tone: 'active' },
  suspended: { label: 'Suspended', tone: 'suspended' },
}

const joinedLabel = (value) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })

/**
 * A column heading that sorts when clicked. The design only shows an arrow on
 * the active column, so the others stay plain until they are picked.
 */
function SortHeader({ label, column, sort, onSort }) {
  const active = sort.column === column
  const Arrow = sort.direction === 'asc' ? ChevronUp : ChevronDown

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`flex items-center gap-1 text-left text-[11px] leading-[1.5] whitespace-nowrap ${
        active ? 'font-bold text-[#17191f]' : 'font-medium text-[#686b73]'
      }`}
    >
      {label}
      {active && <Arrow size={12} aria-hidden="true" />}
    </button>
  )
}

export default function UserTable({ users, sort, onSort, selected, onToggle }) {
  return (
    <div className="w-full overflow-hidden rounded-[12px] outline-1 outline-offset-[-1px] outline-[#dad9d4]">
      <div className={`${GRID} h-11 border-b border-[#dad9d4] bg-[#f8f7f3] px-4`}>
        <span aria-hidden="true" />
        <SortHeader label="Name / email" column="name" sort={sort} onSort={onSort} />
        <p className="text-[11px] leading-[1.5] text-[#686b73]">Role</p>
        <p className="text-[11px] leading-[1.5] text-[#686b73]">Plan</p>
        <p className="text-[11px] leading-[1.5] text-[#686b73]">Status</p>
        <SortHeader label="Joined" column="created_at" sort={sort} onSort={onSort} />
        <span aria-hidden="true" />
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className={`${GRID} h-11 border-b border-[#f2f1ec] px-4 last:border-b-0`}
        >
          <input
            type="checkbox"
            checked={selected.has(user.id)}
            onChange={() => onToggle(user.id)}
            aria-label={`Select ${user.name}`}
            className="size-[14px] shrink-0 rounded-[4px] border border-[#dad9d4] accent-[#0033ff]"
          />

          <div className="flex min-w-0 flex-col">
            <p className="truncate text-[11px] leading-[1.5] text-[#17191f]">{user.name}</p>
            <p className="truncate text-[10px] leading-[1.5] text-[#686b73]">{user.email}</p>
          </div>

          <p className="truncate text-[11px] leading-[1.5] text-[#17191f]">
            {ROLE_LABELS[user.role] ?? user.role}
          </p>

          <span>
            <SubscriptionBadge plan={user.plan} />
          </span>

          <span>
            <StatusBadge tone={STATUS[user.status]?.tone ?? 'active'}>
              {STATUS[user.status]?.label ?? user.status}
            </StatusBadge>
          </span>

          <p className="text-[11px] leading-[1.5] whitespace-nowrap text-[#17191f]">
            {joinedLabel(user.created_at)}
          </p>

          <button
            type="button"
            aria-label={`Actions for ${user.name}`}
            className="flex size-6 items-center justify-center rounded-[6px] text-[#686b73] hover:bg-[#f8f7f3]"
          >
            <MoreVertical size={16} aria-hidden="true" />
          </button>
        </div>
      ))}

      {users.length === 0 && (
        <div className="flex h-[88px] items-center justify-center px-4">
          <p className="text-[11px] leading-[1.5] text-[#686b73]">
            No accounts match these filters.
          </p>
        </div>
      )}
    </div>
  )
}
