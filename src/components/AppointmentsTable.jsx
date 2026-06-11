import React from 'react'
import { formatDate, isToday, highlightMatch, STATUS_COLORS, TYPE_COLORS } from '../utils/helpers'

// ─── جدول المواعيد الرئيسي ────────────────────────────────────────────────
export default function AppointmentsTable({ appointments, nameQuery, onCycleStatus, onDelete, sortBy, onSortChange }) {
  if (!appointments.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          لا توجد نتائج مطابقة
          <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-3)' }}>
            جرّب تغيير معايير البحث أو مسح الفلاتر
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Results bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
          عرض <strong style={{ color: 'var(--text-1)' }}>{appointments.length}</strong> موعد
        </span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="date-asc">الأقرب أولاً</option>
          <option value="date-desc">الأبعد أولاً</option>
          <option value="name-asc">الاسم أ–ي</option>
          <option value="status">حسب الحالة</option>
        </select>
      </div>

      {/* Header */}
      <div className="table-header">
        <div className="th">المريض</div>
        <div className="th">البطاقة</div>
        <div className="th">التاريخ</div>
        <div className="th">الوقت</div>
        <div className="th">النوع</div>
        <div className="th">الحالة</div>
        <div className="th"></div>
      </div>

      {/* Rows */}
      {appointments.map(appt => (
        <AppointmentRow
          key={appt.id}
          appt={appt}
          nameQuery={nameQuery}
          onCycleStatus={onCycleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// ── صف واحد ───────────────────────────────────────────────────────────────
function AppointmentRow({ appt, nameQuery, onCycleStatus, onDelete }) {
  const highlighted = highlightMatch(appt.name, nameQuery)

  return (
    <div className="table-row">
      {/* المريض */}
      <div>
        <div
          className="patient-name"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        <div className="patient-sub">
          {appt.phone}&nbsp;
          {appt.whatsapp
            ? <span className="wa-dot">● WA</span>
            : <span className="sms-dot">SMS</span>
          }
        </div>
      </div>

      {/* البطاقة الوطنية (تم التعديل ليطابق الاسم الجديد national_id) */}
      <div className="td" style={{ fontSize: '12px', color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>
        {appt.national_id || '—'}
      </div>

      {/* التاريخ */}
      <div className="td" style={{ fontSize: '12px', color: 'var(--text-2)' }}>
        {formatDate(appt.date)}
        {isToday(appt.date) && <span className="today-badge" style={{ marginRight: '6px' }}>اليوم</span>}
      </div>

      {/* الوقت */}
      <div className="td">{appt.time}</div>

      {/* النوع */}
      <div className="td">
        <span className={`badge ${TYPE_COLORS[appt.type]}`}>{appt.type}</span>
      </div>

      {/* الحالة */}
      <div className="td">
        <button
          className={`badge ${STATUS_COLORS[appt.status]}`}
          onClick={() => onCycleStatus(appt.id)}
          title="اضغط لتغيير الحالة"
        >
          {appt.status}
        </button>
      </div>

      {/* حذف */}
      <div className="td">
        <button
          className="btn-icon"
          onClick={() => onDelete(appt.id)}
          title="حذف الموعد"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
