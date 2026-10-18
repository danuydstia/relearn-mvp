const PLOT_WIDTH = 318
const PLOT_HEIGHT = 80
const TOP_INSET = 6
const USABLE_HEIGHT = 62
const SIDE_INSET = 12

const format = (value) => new Intl.NumberFormat('en-US').format(value)

/**
 * TrendChart — line chart + month axis (design nodes 10:62551 and 10:62582).
 *
 * Drawn from the data rather than the design's static vector file so real
 * account totals render correctly. The geometry follows the design: an 80px
 * plot with three grid lines and a 62px series inset by 6px on top.
 */
export default function TrendChart({ points }) {
  const values = points.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min
  const step = values.length > 1 ? (PLOT_WIDTH - SIDE_INSET * 2) / (values.length - 1) : 0

  const path = values
    .map((value, index) => {
      const x = SIDE_INSET + index * step
      // A flat series (every month the same total) sits on the midline rather
      // than hugging the baseline.
      const y = span === 0 ? TOP_INSET + USABLE_HEIGHT / 2 : TOP_INSET + (1 - (value - min) / span) * USABLE_HEIGHT
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative h-[80px] w-full">
        <div className="absolute inset-x-0 top-0 h-px bg-[#f2f1ec]" />
        <div className="absolute inset-x-0 top-[35px] h-px bg-[#f2f1ec]" />
        <div className="absolute inset-x-0 top-[70px] h-px bg-[#f2f1ec]" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="#0033ff"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="absolute top-[56px] left-0 text-[10px] leading-[normal] text-[#686b73]">
          {format(min)}
        </p>
        <p className="absolute top-0 right-0 text-[11px] leading-[normal] font-bold text-[#0033ff]">
          {format(values[values.length - 1])}
        </p>
      </div>
      <div className="flex w-full items-start justify-between text-[#686b73]">
        {points.map((point) => (
          <div key={point.month} className="flex flex-col items-center gap-[2px]">
            <p className="text-[10px] leading-[1.5]">{point.label}</p>
            <p className="text-[9px] leading-[1.5]">{format(point.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
