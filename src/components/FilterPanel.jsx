import React, { useState } from 'react'
import { APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from '../data/appointments'

const QUICK_PRESETS = [
  { key: 'today',    label: '📅 اليوم' },
  { key: 'tomorrow', label: 'غداً' },
  { key: 'week',     label: 'هذا الأسبوع' },
  { key: 'month',    label: 'هذا الشهر' },
  { key: 'pending',  label: 'مجدول فقط' },
  { key: 'wa',       label: '📲 واتساب فقط' },
]

const PILL_LABELS = {
  name:   'الاسم',
  cin:    'البطاقة',
  phone:  'الهاتف',
  exact:  'يوم',
  from:   'من',
  to:     'إلى',
  status: 'الحالة',
  type:   'النوع',
  wa:     'القناة',
}

// ─── لوحة الفلاتر المتقدمة ────────────────────────────────────────────────
export default function FilterPanel({ filters, setFilter, resetFilters, applyQuick, activeCount }) {
  const [open, setOpen] = useState(false)

  const activePills = Object.entries(filters).filter(([, v]) => v)

  return (
    <div className="card mb-4">
      {/* Toggle header */}
      <div className="filter-toggle" onClick={() => setOpen(o => !o)}>
        <div className="filter-toggle-left">
          <span>🔍</span>
          البحث والتصفية المتقدمة
          {activeCount > 0 && (
            <span className="filter-count">{activeCount}</span>
          )}
        </div>
        <span style={{ fontSize: '18px', color: 'var(--text-2)', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>
          ⌄
        </span>
      </div>

      {/* Filter body */}
      {open && (
        <div className="filter-body">
          {/* Quick presets */}
          <div className="quick-row">
            {QUICK_PRESETS.map(p => (
              <button
                key={p.key}
                className="quick-btn"
                onClick={() => applyQuick(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Filter fields */}
          <div className="filter-grid">
            <div className="field">
              <label>اسم المريض</label>
              <input type="text" placeholder="ابحث بالاسم..."
                value={filters.name} onChange={e => setFilter('name', e.target.value)} />
            </div>
            <div className="field">
              <label>رقم البطاقة الوطنية</label>
              <input type="text" placeholder="AB123456"
                value={filters.cin} onChange={e => setFilter('cin', e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="field">
              <label>رقم الهاتف</label>
              <input type="text" placeholder="0612..."
                value={filters.phone} onChange={e => setFilter('phone', e.target.value)} />
            </div>
            <div className="field">
              <label>يوم بعينه</label>
              <input type="date"
                value={filters.exact} onChange={e => setFilter('exact', e.target.value)} />
            </div>
            <div className="field">
              <label>من تاريخ</label>
              <input type="date"
                value={filters.from} onChange={e => setFilter('from', e.target.value)} />
            </div>
            <div className="field">
              <label>إلى تاريخ</label>
              <input type="date"
                value={filters.to} onChange={e => setFilter('to', e.target.value)} />
            </div>
            <div className="field">
              <label>الحالة</label>
              <select value={filters.status} onChange={e => setFilter('status', e.target.value)}>
                <option value="">كل الحالات</option>
                {APPOINTMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>النوع</label>
              <select value={filters.type} onChange={e => setFilter('type', e.target.value)}>
                <option value="">كل الأنواع</option>
                {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>قناة التواصل</label>
              <select value={filters.wa} onChange={e => setFilter('wa', e.target.value)}>
                <option value="">الكل</option>
                <option value="true">واتساب فقط</option>
                <option value="false">SMS فقط</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-ghost" onClick={resetFilters}>
              ✕ مسح الكل
            </button>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="pills-row">
          {activePills.map(([key, val]) => (
            <span className="pill" key={key}>
              {PILL_LABELS[key] || key}: {key === 'wa' ? (val === 'true' ? 'واتساب' : 'SMS') : val}
              <button className="pill-remove" onClick={() => setFilter(key, '')}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
