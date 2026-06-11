// ─── مساعدات التاريخ والنصوص ───────────────────────────────────────────────

export const getToday = () => new Date().toISOString().split('T')[0]

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ar-MA', {
    weekday: 'short',
    day:     'numeric',
    month:   'short',
  })
}

export const isToday = (dateStr) => dateStr === getToday()

export const addDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export const highlightMatch = (text, query) => {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

// ─── ثوابت الألوان لكل حالة ونوع (مرجع مركزي) ──────────────────────────────
export const STATUS_COLORS = {
  'مجدول': 'status-pending',
  'مؤكد':  'status-confirmed',
  'مكتمل': 'status-completed',
  'ملغى':  'status-cancelled',
}

export const TYPE_COLORS = {
  'كشف':    'type-checkup',
  'متابعة': 'type-followup',
  'طوارئ':  'type-emergency',
  'عملية':  'type-operation',
}
