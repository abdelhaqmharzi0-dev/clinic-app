# 🏥 عيادة المساعدة الطبية — نظام إدارة المواعيد

## هيكل المشروع

```
clinic-app/
│
├── index.html                    # نقطة الدخول HTML (RTL + خط عربي)
├── vite.config.js                # إعداد Vite
├── package.json
│
└── src/
    ├── main.jsx                  # تهيئة React
    ├── App.jsx                   # المكوّن الجذر — يجمع كل شيء
    │
    ├── components/               # مكوّنات واجهة المستخدم
    │   ├── AppointmentForm.jsx   # نموذج إضافة موعد (مع CIN)
    │   ├── AppointmentsTable.jsx # جدول المواعيد مع تمييز البحث
    │   ├── FilterPanel.jsx       # لوحة الفلاتر المتقدمة + Pills
    │   ├── TodayPanel.jsx        # بطاقات مواعيد اليوم
    │   ├── StatsRow.jsx          # شريط الإحصائيات
    │   └── Toast.jsx             # إشعار مؤقت
    │
    ├── hooks/                    # منطق الحالة (State Logic)
    │   ├── useAppointments.js    # CRUD + إحصائيات + إشعارات
    │   └── useFilters.js         # فلترة + ترتيب + اختصارات سريعة
    │
    ├── data/
    │   └── appointments.js       # بيانات تجريبية + ثوابت (TYPES, STATUSES)
    │
    ├── utils/
    │   └── helpers.js            # تنسيق التاريخ + ألوان الـ badges + highlight
    │
    └── styles/
        ├── globals.css           # متغيرات CSS + base styles + toast
        └── components.css        # تنسيقات كل المكوّنات
```

---

## تشغيل المشروع

```bash
npm install
npm run dev
```

افتح المتصفح على: http://localhost:5173

---

## الربط مع Supabase (المرحلة التالية)

### 1. إنشاء الجدول في Supabase

```sql
create table appointments (
  id          bigint generated always as identity primary key,
  name        text not null,
  cin         text not null,
  phone       text not null,
  date        date not null,
  time        text not null,
  type        text not null default 'كشف',
  status      text not null default 'مجدول',
  whatsapp    boolean default true,
  created_at  timestamptz default now()
);
```

### 2. تثبيت Supabase client

```bash
npm install @supabase/supabase-js
```

### 3. إنشاء ملف src/lib/supabase.js

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 4. استبدال useAppointments.js

استبدل `useState(SAMPLE_APPOINTMENTS)` بـ:

```js
// جلب البيانات عند التحميل
useEffect(() => {
  supabase.from('appointments').select('*').order('date').then(({ data }) => {
    if (data) setAppointments(data)
  })
}, [])

// حفظ موعد جديد
const addAppointment = async (formData) => {
  const { data } = await supabase.from('appointments').insert([formData]).select()
  if (data) setAppointments(prev => [...prev, data[0]])
}

// تحديث الحالة
const updateStatus = async (id, newStatus) => {
  await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
  setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
}
```

### 5. ملف .env

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## الربط مع n8n

عند إضافة موعد، يمكن إرسال Webhook إلى n8n:

```js
// في addAppointment بعد الحفظ في Supabase
await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newAppt)
})
```

n8n يستقبل البيانات ويحسب وقت التذكير (تاريخ الموعد - 24 ساعة) ثم يرسل الرسالة عبر واتساب أو SMS.
