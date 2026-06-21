// Monochrome GitHub contribution heatmap, recolored white-on-dark to match the
// site's design language. `weeks` is oldest→newest, each up to 7 daily counts.
// The grid is fluid — week columns flex to fill the card width, so it never
// needs horizontal scrolling.

const LEVEL_OPACITY = [0.06, 0.2, 0.38, 0.58, 0.85]

function levelFor(count: number, max: number): number {
  if (count <= 0) return 0
  if (max <= 0) return 1
  const r = count / max
  if (r > 0.66) return 4
  if (r > 0.33) return 3
  if (r > 0.12) return 2
  return 1
}

export default function ContributionHeatmap({ weeks }: { weeks: number[][] }) {
  const max = weeks.reduce((m, w) => w.reduce((mm, c) => Math.max(mm, c), m), 0)
  return (
    <div style={{ display: 'flex', gap: 2, width: '100%' }}>
      {weeks.map((week, wi) => (
        <div
          key={wi}
          style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '1 1 0', minWidth: 0 }}
        >
          {Array.from({ length: 7 }, (_, di) => {
            const count = week[di] ?? -1
            const present = count >= 0
            const lvl = present ? levelFor(count, max) : 0
            return (
              <div
                key={di}
                title={present ? `${count} contributionia` : ''}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 2,
                  background: present
                    ? `rgba(255,255,255,${LEVEL_OPACITY[lvl]})`
                    : 'transparent',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
