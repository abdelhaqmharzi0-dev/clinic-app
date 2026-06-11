// ─── بيانات تجريبية ────────────────────────────────────────────────────────
// استبدل هذا الملف لاحقاً بـ Supabase client

const today = new Date()
const fmt = (offset = 0) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

export const SAMPLE_APPOINTMENTS = [
  { id: 1, name: 'ياسين المرابط',    cin: 'AB123456', phone: '0661234567', date: fmt(0),  time: '09:30', type: 'كشف',    status: 'مؤكد',    whatsapp: true  },
  { id: 2, name: 'فاطمة الزهراء',    cin: 'CD789012', phone: '0612345678', date: fmt(0),  time: '10:00', type: 'متابعة', status: 'مجدول',   whatsapp: true  },
  { id: 3, name: 'حمزة بن علي',      cin: 'EF345678', phone: '0698765432', date: fmt(0),  time: '11:30', type: 'طوارئ',  status: 'مجدول',   whatsapp: false },
  { id: 4, name: 'أمينة قاسمي',      cin: 'GH901234', phone: '0655443322', date: fmt(1),  time: '14:00', type: 'كشف',    status: 'مجدول',   whatsapp: true  },
  { id: 5, name: 'عبد الله الفاسي',  cin: 'IJ567890', phone: '0677889900', date: fmt(-1), time: '09:00', type: 'عملية',  status: 'مكتمل',   whatsapp: true  },
  { id: 6, name: 'سلمى بوزيان',      cin: 'KL123456', phone: '0633221100', date: fmt(2),  time: '10:30', type: 'متابعة', status: 'مجدول',   whatsapp: true  },
  { id: 7, name: 'يوسف الإدريسي',    cin: 'MN789012', phone: '0644556677', date: fmt(3),  time: '08:00', type: 'كشف',    status: 'مجدول',   whatsapp: false },
  { id: 8, name: 'مريم التازي',       cin: 'OP345678', phone: '0622334455', date: fmt(-2), time: '15:00', type: 'متابعة', status: 'مكتمل',   whatsapp: true  },
  { id: 9, name: 'خالد الرحموني',    cin: 'QR901234', phone: '0688997700', date: fmt(5),  time: '11:00', type: 'طوارئ',  status: 'ملغى',    whatsapp: true  },
  { id: 10,name: 'نادية الشرقاوي',   cin: 'ST567890', phone: '0699001122', date: fmt(7),  time: '16:00', type: 'كشف',    status: 'مجدول',   whatsapp: false },
]

export const APPOINTMENT_TYPES   = ['كشف', 'متابعة', 'طوارئ', 'عملية']
export const APPOINTMENT_STATUSES = ['مجدول', 'مؤكد', 'مكتمل', 'ملغى']

export const STATUS_CYCLE = {
  'مجدول': 'مؤكد',
  'مؤكد':  'مكتمل',
  'مكتمل': 'ملغى',
  'ملغى':  'مجدول',
}
