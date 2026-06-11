import React from 'react'

// ─── شريط الإحصائيات ──────────────────────────────────────────────────────
export default function StatsRow({ stats, filteredCount }) {
  const items = [
    { label: 'إجمالي المواعيد', value: stats.total   },
    { label: 'مؤكدة',           value: stats.confirmed },
    { label: 'مجدولة',          value: stats.pending   },
    { label: 'ملغاة',           value: stats.cancelled },
    { label: 'نتائج الفلتر',    value: filteredCount   },
  ]

  return (
    <div className="stats-row mb-6">
      {items.map(item => (
        <div className="stat-card" key={item.label}>
          <div className="stat-label">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
