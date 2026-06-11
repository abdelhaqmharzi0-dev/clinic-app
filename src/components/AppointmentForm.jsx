import React, { useState } from 'react'
import { APPOINTMENT_TYPES } from '../data/appointments'
import { getToday } from '../utils/helpers'

const EMPTY_FORM = {
  name:             '',
  national_id:      '',
  phone:            '',
  date:             getToday(),
  time:             '09:00',
  appointment_type: 'كشف', // الحقل الجديد
  whatsapp:         'true',
}

export default function AppointmentForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'الاسم مطلوب'
    if (!form.national_id.trim()) e.national_id = 'رقم البطاقة مطلوب'
    if (!form.phone.trim())       e.phone       = 'الهاتف مطلوب'
    if (!form.date)               e.date        = 'التاريخ مطلوب'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onAdd({ ...form, whatsapp: form.whatsapp === 'true' })
    setForm({ ...EMPTY_FORM, date: getToday() })
    setErrors({})
  }

  return (
    <div className="card mb-6">
      <div className="card-header">
        <span>➕</span> إضافة موعد جديد
      </div>

      <div className="form-grid">
        <Field label="اسم المريض *" error={errors.name}>
          <input type="text" placeholder="محمد الأمين" value={form.name} onChange={e => set('name', e.target.value)} />
        </Field>

        <Field label="رقم البطاقة الوطنية *" error={errors.national_id}>
          <input type="text" placeholder="AB123456" value={form.national_id} onChange={e => set('national_id', e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
        </Field>

        <Field label="رقم الهاتف *" error={errors.phone}>
          <input type="tel" placeholder="0612345678" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </Field>

        <Field label="تاريخ الموعد *" error={errors.date}>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </Field>

        <Field label="الوقت">
          <input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
        </Field>

        {/* حقل نوع الزيارة الجديد */}
        <Field label="نوع الزيارة">
          <select value={form.appointment_type} onChange={e => set('appointment_type', e.target.value)}>
            {APPOINTMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>

        <Field label="قناة التواصل">
          <select value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}>
            <option value="true">واتساب ✓</option>
            <option value="false">SMS</option>
          </select>
        </Field>
      </div>

      <div className="form-footer">
        <button className="btn btn-primary" onClick={handleSubmit}>
          <span>➕</span> إضافة الموعد
        </button>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <span style={{ fontSize: '11px', color: 'var(--red-600)', marginTop: '3px', display: 'block' }}>{error}</span>}
    </div>
  )
}
