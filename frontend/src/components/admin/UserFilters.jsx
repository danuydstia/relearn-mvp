import { ArrowDown, ChevronDown, Search } from 'lucide-react'

/**
 * UserFilters — the account list's toolbar (design 10:62782).
 *
 * A 40px row: a 316px search field, three dropdowns, a flexible spacer and the
 * 144px CSV export. The spacer is what pins the export to the right edge, the
 * same trick the design uses for its "Filter spacer".
 */
const ROLES = [
  { value: '', label: 'All roles' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
]

const PLANS = [
  { value: '', label: 'All plans' },
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
]

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
]

/** A bordered dropdown chip. The chevron is decorative, so the select keeps the label role. */
function FilterSelect({ name, value, options, onChange }) {
  return (
    <div className="relative flex h-10 shrink-0 items-center rounded-[6px] border border-[#dad9d4] bg-white pl-3">
      <select
        aria-label={name}
        value={value}
        onChange={onChange}
        className="h-full min-w-0 appearance-none bg-transparent pr-7 text-[11px] leading-[1.5] whitespace-nowrap text-[#17191f] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2 shrink-0 text-[#686b73]"
        aria-hidden="true"
      />
    </div>
  )
}

export default function UserFilters({ search, onSearchChange, value, onChange, onExport }) {
  return (
    <div className="flex h-10 w-full items-center gap-2">
      <div className="flex h-10 w-[316px] shrink-0 items-center gap-2 rounded-[6px] border border-[#dad9d4] bg-white px-3">
        <Search size={16} className="shrink-0 text-[#686b73]" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search by name or email"
          placeholder="Search name or email"
          className="w-full min-w-0 border-0 bg-transparent text-[11px] leading-[1.5] text-[#17191f] outline-none placeholder:text-[#686b73]"
        />
      </div>

      <FilterSelect
        name="Role"
        value={value.role}
        options={ROLES}
        onChange={(event) => onChange({ role: event.target.value })}
      />
      <FilterSelect
        name="Plan"
        value={value.plan}
        options={PLANS}
        onChange={(event) => onChange({ plan: event.target.value })}
      />
      <FilterSelect
        name="Status"
        value={value.status}
        options={STATUSES}
        onChange={(event) => onChange({ status: event.target.value })}
      />

      <div className="min-w-0 flex-1" />

      <button
        type="button"
        onClick={onExport}
        className="flex h-10 w-[144px] shrink-0 items-center justify-center gap-1 rounded-[6px] border border-[#dad9d4] bg-white text-[12px] font-semibold text-[#17191f]"
      >
        <ArrowDown size={14} aria-hidden="true" />
        Export CSV
      </button>
    </div>
  )
}
