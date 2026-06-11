import React, { useState } from 'react'
import './styles/components.css'

import { useAppointments } from './hooks/useAppointments'
import { useFilters }      from './hooks/useFilters'

import AppointmentForm   from './components/AppointmentForm'
import FilterPanel       from './components/FilterPanel'
import AppointmentsTable from './components/AppointmentsTable'
import TodayPanel        from './components/TodayPanel'
import StatsRow          from './components/StatsRow'
import Toast             from './components/Toast'

import { getToday } from './utils/helpers'

// ─── المكوّن الجذر ────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('all')

  const {
    appointments,
    todayAppointments,
    stats,
    notification,
    addAppointment,
    updateStatus,
    cycleStatus,
    deleteAppointment,
  } = useAppointments()

  const {
    filters,
    setFilter,
    resetFilters,
    applyQuick,
    activeCount,
    filtered,
    sortBy,
    setSortBy,
  } = useFilters(appointments)

  return (
    <div className="app-wrapper">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-logo">🏥</div>
        <div>
          <h1>عيادة المساعدة الطبية</h1>
          <p>📅 اليوم: {new Date().toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          📋 جميع المواعيد
          <span className="tab-badge">{appointments.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          📅 مواعيد اليوم
          <span className="tab-badge">{todayAppointments.length}</span>
        </button>
      </div>

      {/* ── All appointments tab ────────────────────────────────────── */}
      {activeTab === 'all' && (
        <>
          <AppointmentForm onAdd={addAppointment} />

          <StatsRow stats={stats} filteredCount={filtered.length} />

          <FilterPanel
            filters={filters}
            setFilter={setFilter}
            resetFilters={resetFilters}
            applyQuick={applyQuick}
            activeCount={activeCount}
          />

          <AppointmentsTable
            appointments={filtered}
            nameQuery={filters.name}
            onCycleStatus={cycleStatus}
            onDelete={deleteAppointment}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </>
      )}

      {/* ── Today tab ──────────────────────────────────────────────── */}
      {activeTab === 'today' && (
        <TodayPanel
          appointments={todayAppointments}
          onUpdateStatus={updateStatus}
        />
      )}

      {/* ── Toast notification ─────────────────────────────────────── */}
      <Toast message={notification} />
    </div>
  )
}
