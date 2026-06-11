import { useState, useEffect, useMemo } from 'react'
import { STATUS_CYCLE } from '../data/appointments'
import { getToday } from '../utils/helpers'
import { supabase } from '../supabase'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })

    if (error) {
      console.error('خطأ في جلب البيانات:', error)
    } else if (data) {
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.patient_name,
        phone: item.phone_number,
        national_id: item.national_id || '',
        type: item.appointment_type || 'كشف', // جلب نوع الزيارة
        date: item.appointment_date,
        time: item.appointment_time,
        status: item.status,
        whatsapp: item.whatsapp // تأكد من جلب هذا الحقل إذا كان موجوداً في قاعدة البيانات
      }))
      setAppointments(formattedData)
    }
  }

  const addAppointment = async (formData) => {
    const dbData = {
      patient_name: formData.name,
      phone_number: formData.phone,
      national_id: formData.national_id,
      appointment_type: formData.appointment_type, // إرسال النوع الجديد
      appointment_date: formData.date,
      appointment_time: formData.time,
      status: 'مجدول',
      whatsapp: formData.whatsapp // إرسال حالة الواتساب
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([dbData])
      .select()

    if (error) {
      console.error("خطأ في الإضافة:", error)
      notify(`❌ حدث خطأ أثناء إضافة الموعد`)
      return null
    }

    if (data && data.length > 0) {
      const newItem = data[0]
      const newAppt = {
        id: newItem.id,
        name: newItem.patient_name,
        phone: newItem.phone_number,
        national_id: newItem.national_id || '',
        type: newItem.appointment_type, // إضافة النوع للكائن الجديد
        date: newItem.appointment_date,
        time: newItem.appointment_time,
        status: newItem.status,
        whatsapp: newItem.whatsapp
      }
      setAppointments(prev => [...prev, newAppt])
      notify(`✓ تم إضافة موعد ${newAppt.name} بنجاح`)
      return newAppt
    }
  }

  // ... (باقي الدوال: updateStatus, cycleStatus, deleteAppointment تبقى كما هي)
  
  const updateStatus = async (id, newStatus) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    )
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
    if (error) console.error("خطأ في التحديث:", error)
  }

  const cycleStatus = (id) => {
    const appt = appointments.find(a => a.id === id)
    if (!appt) return
    updateStatus(id, STATUS_CYCLE[appt.status])
  }

  const deleteAppointment = async (id) => {
    const appt = appointments.find(a => a.id === id)
    setAppointments(prev => prev.filter(a => a.id !== id))
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (!error && appt) notify(`تم حذف موعد ${appt.name}`)
  }

  const todayAppointments = useMemo(() =>
    appointments
      .filter(a => a.date === getToday())
      .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments]
  )

  const stats = useMemo(() => ({
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'مؤكد').length,
    pending: appointments.filter(a => a.status === 'مجدول').length,
    cancelled: appointments.filter(a => a.status === 'ملغى').length,
    today: todayAppointments.length,
  }), [appointments, todayAppointments])

  const notify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }

  return {
    appointments,
    todayAppointments,
    stats,
    notification,
    addAppointment,
    updateStatus,
    cycleStatus,
    deleteAppointment,
  }
}
