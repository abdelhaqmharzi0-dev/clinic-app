import React from 'react'
import { formatDate, getToday, TYPE_COLORS, STATUS_COLORS } from '../utils/helpers'

// ─── لوحة مواعيد اليوم ────────────────────────────────────────────────────
export default function TodayPanel({ appointments, onUpdateStatus }) {
  if (!appointments.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          لا توجد مواعيد اليوم
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500 }}>مواعيد اليوم</h2>
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
          📅 {formatDate(getToday())}
        </span>
      </div>

      <div className="card">
        {appointments.map(appt => (
          <TodayCard
            key={appt.id}
            appt={appt}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  )
}

// ── بطاقة موعد واحد (تم تحسين التنسيق لمنع التداخل) ─────────────────────────
function TodayCard({ appt, onUpdateStatus }) {
  const accentClass =
    appt.status === 'مؤكد'  ? 'accent-confirmed' :
    appt.status === 'ملغى'  ? 'accent-cancelled'  : ''

  const hour = parseInt(appt.time)

  return (
    <div className={`today-card ${accentClass}`} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      
      {/* الوقت: ثابت العرض لمنع التداخل */}
      <div className="time-block" style={{ minWidth: '60px' }}>
        <div className="time-hour">{appt.time}</div>
        <div className="time-ampm">{hour < 12 ? 'ص' : 'م'}</div>
      </div>

      {/* معلومات المريض: تأخذ باقي المساحة */}
      <div style={{ flex: 1 }}>
        <div className="card-name" style={{ fontWeight: 'bold' }}>{appt.name}</div>
        <div className="card-sub" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
          <span>📞 {appt.phone}</span>
          {/* تم تعديل cin إلى national_id */}
          {appt.national_id && <span style={{ color: 'var(--text-3)' }}>📋 {appt.national_id}</span>}
          <span className={`badge ${TYPE_COLORS[appt.type]}`}>{appt.type}</span>
          <span className={`badge ${STATUS_COLORS[appt.status]}`}>{appt.status}</span>
          <span>{appt.whatsapp ? '📲 واتساب' : '📱 SMS'}</span>
        </div>
      </div>

      {/* أزرار الإجراء */}
      <div className="card-actions" style={{ display: 'flex', gap: '5px' }}>
        {appt.status !== 'مؤكد' && appt.status !== 'مكتمل' && (
          <button className="btn-confirm" onClick={() => onUpdateStatus(appt.id, 'مؤكد')}>
            تأكيد ✓
          </button>
        )}
        {appt.status !== 'ملغى' && appt.status !== 'مكتمل' && (
          <button className="btn-cancel-appt" onClick={() => onUpdateStatus(appt.id, 'ملغى')}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  )
}
