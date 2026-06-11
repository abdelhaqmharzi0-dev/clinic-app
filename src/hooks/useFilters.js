import { useState, useMemo } from 'react'
import { getToday, addDays } from '../utils/helpers'

const EMPTY_FILTERS = {
  name:   '',
  cin:    '',
  phone:  '',
  exact:  '',
  from:   '',
  to:     '',
  status: '',
  type:   '',
  wa:     '',
}

// ─── Hook إدارة الفلاتر والبحث ────────────────────────────────────────────
export function useFilters(appointments) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sortBy,  setSortBy]  = useState('date-asc')

  const setFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters(EMPTY_FILTERS)

  const applyQuick = (preset) => {
    const base = { ...EMPTY_FILTERS }
    if (preset === 'today')    base.exact  = getToday()
    if (preset === 'tomorrow') base.exact  = addDays(1)
    if (preset === 'week')     { base.from = getToday(); base.to = addDays(7)  }
    if (preset === 'month')    { base.from = getToday(); base.to = addDays(30) }
    if (preset === 'pending')  base.status = 'مجدول'
    if (preset === 'wa')       base.wa     = 'true'
    setFilters(base)
  }

  const activeCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  )

  const filtered = useMemo(() => {
    let list = appointments.filter(a => {
      if (filters.name   && !a.name.includes(filters.name))     return false
      if (filters.cin    && !a.cin.includes(filters.cin))       return false
      if (filters.phone  && !a.phone.includes(filters.phone))   return false
      if (filters.exact  && a.date !== filters.exact)            return false
      if (filters.from   && a.date < filters.from)               return false
      if (filters.to     && a.date > filters.to)                 return false
      if (filters.status && a.status !== filters.status)         return false
      if (filters.type   && a.type   !== filters.type)           return false
      if (filters.wa === 'true'  && !a.whatsapp)                 return false
      if (filters.wa === 'false' &&  a.whatsapp)                 return false
      return true
    })

    list.sort((a, b) => {
      if (sortBy === 'date-asc')  return (a.date + a.time).localeCompare(b.date + b.time)
      if (sortBy === 'date-desc') return (b.date + b.time).localeCompare(a.date + a.time)
      if (sortBy === 'name-asc')  return a.name.localeCompare(b.name, 'ar')
      if (sortBy === 'status') {
        const order = ['طوارئ', 'مجدول', 'مؤكد', 'مكتمل', 'ملغى']
        return order.indexOf(a.status) - order.indexOf(b.status)
      }
      return 0
    })
    return list
  }, [appointments, filters, sortBy])

  return { filters, setFilter, resetFilters, applyQuick, activeCount, filtered, sortBy, setSortBy }
}
