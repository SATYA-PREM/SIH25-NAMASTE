import React, { useEffect, useMemo, useState } from 'react'
import {
  Users, Search, Plus, CheckCircle, Clock, AlertCircle, User, Phone,
  Calendar, FileText, Eye, Filter, ChevronDown, Activity, CalendarCheck,
  Settings, Bell
} from 'lucide-react'

export default function PatientList() {
  const user = { identifier: 'DR-2001', name: 'Dr. Sarah Johnson', specialty: 'AYUSH Medicine', hospital: 'AIIMS Delhi' }

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activePatientId, setActivePatientId] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        abhaId: '91-1234-5678-9012',
        age: 45,
        gender: 'Male',
        phone: '+91-98765-43210',
        email: 'rajesh.kumar@email.com',
        address: 'New Delhi, India',
        lastVisit: '2024-01-15',
        nextAppointment: '2024-02-15',
        priority: 'high',
        conditions: [
          {
            id: 1,
            name: 'Jwara (Fever)',
            namasteCode: 'NAMASTE-001',
            icd11Code: 'ICD11-TM2-001',
            description: 'Acute fever with chills and body ache',
            severity: 'Moderate',
            status: 'Active',
            symptoms: ['Fever', 'Chills', 'Body ache', 'Headache'],
            treatments: ['Giloy', 'Neem', 'Tulsi'],
            prescribedDate: '2024-01-15',
            followUpDate: '2024-02-15'
          },
          {
            id: 2,
            name: 'Madhumeha (Diabetes)',
            namasteCode: 'NAMASTE-045',
            icd11Code: 'ICD11-TM2-045',
            description: 'Type 2 diabetes mellitus',
            severity: 'Mild',
            status: 'Under Treatment',
            symptoms: ['Excessive thirst', 'Frequent urination', 'Weight loss'],
            treatments: ['Bitter gourd', 'Fenugreek', 'Cinnamon'],
            prescribedDate: '2024-01-10',
            followUpDate: '2024-02-10'
          }
        ],
        vitalSigns: { bloodPressure: '140/90', heartRate: '85 bpm', temperature: '101.2°F', weight: '75 kg', height: '170 cm' },
        notes: 'Responding well to treatment.',
        prescriptions: ['Giloy - 500mg twice daily', 'Neem - 200mg once daily', 'Turmeric - 300mg with meals']
      },
      {
        id: 2,
        name: 'Priya Sharma',
        abhaId: '91-2345-6789-0123',
        age: 32,
        gender: 'Female',
        phone: '+91-87654-32109',
        email: 'priya.sharma@email.com',
        address: 'Mumbai, India',
        lastVisit: '2024-01-10',
        nextAppointment: null,
        priority: 'medium',
        conditions: [
          {
            id: 3,
            name: 'Amlapitta (Acid Peptic Disease)',
            namasteCode: 'NAMASTE-023',
            icd11Code: 'ICD11-TM2-023',
            description: 'Gastric acidity with burning',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Heartburn', 'Acid reflux', 'Chest burning'],
            treatments: ['Amla', 'Licorice', 'Aloe vera'],
            prescribedDate: '2024-01-05',
            followUpDate: null
          }
        ],
        vitalSigns: { bloodPressure: '120/80', heartRate: '72 bpm', temperature: '98.6°F', weight: '62 kg', height: '165 cm' },
        notes: 'Condition resolved.',
        prescriptions: ['Amla - 1 tsp with water', 'Licorice - 200mg twice daily']
      },
      {
        id: 3,
        name: 'Amit Singh',
        abhaId: '91-3456-7890-1234',
        age: 28,
        gender: 'Male',
        phone: '+91-76543-21098',
        email: 'amit.singh@email.com',
        address: 'Bangalore, India',
        lastVisit: '2024-01-05',
        nextAppointment: '2024-01-20',
        priority: 'low',
        conditions: [
          {
            id: 4,
            name: 'Nazla (Common Cold)',
            namasteCode: 'NAMASTE-012',
            icd11Code: 'ICD11-TM2-012',
            description: 'Common cold',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Nasal congestion', 'Mild cough', 'Runny nose'],
            treatments: ['Honey', 'Ginger', 'Turmeric milk'],
            prescribedDate: '2024-01-01',
            followUpDate: null
          }
        ],
        vitalSigns: { bloodPressure: '110/70', heartRate: '68 bpm', temperature: '98.4°F', weight: '70 kg', height: '175 cm' },
        notes: 'Recovered fully.',
        prescriptions: ['Honey with ginger - 1 tsp twice daily', 'Turmeric milk before bedtime']
      }
    ]

    const timer = setTimeout(() => {
      setPatients(mockPatients)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const metrics = useMemo(() => {
    const total = patients.length
    const active = patients.reduce(
      (acc, p) => acc + p.conditions.filter(c => c.status === 'Active' || c.status === 'Under Treatment').length,
      0
    )
    const resolved = patients.reduce(
      (acc, p) => acc + p.conditions.filter(c => c.status === 'Resolved').length,
      0
    )
    const upcoming = patients.filter(p => p.nextAppointment).length
    return { total, active, resolved, upcoming }
  }, [patients])

  const stats = [
    { title: 'Total Patients', value: patients.length, icon: Users, color: 'blue' },
    { title: 'Active Cases', value: metrics.active, icon: Activity, color: 'orange' },
    { title: 'Resolved Cases', value: metrics.resolved, icon: CheckCircle, color: 'green' },
    { title: 'Appointments', value: metrics.upcoming, icon: CalendarCheck, color: 'purple' }
  ]

  const derivePatientStatus = (p) => {
    const hasActive = p.conditions.some(c => c.status === 'Active' || c.status === 'Under Treatment')
    const allResolved = p.conditions.length > 0 && p.conditions.every(c => c.status === 'Resolved')
    if (hasActive) return 'active'
    if (allResolved) return 'resolved'
    return 'pending'
  }

  const getStatusConfig = (status) => {
    if (status === 'active') return { label: 'Active', class: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle }
    if (status === 'resolved') return { label: 'Resolved', class: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle }
    return { label: 'Pending', class: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock }
  }

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.trim().toLowerCase()
    if (q && !(
      p.name.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.conditions.some((c) => c.name.toLowerCase().includes(q))
    )) return false
    const status = derivePatientStatus(p)
    if (filterStatus === 'all') return true
    return filterStatus === status
  })

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'My Patients', icon: Users , active: true},
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Your Dashboard</h3>
          <p className="text-slate-500">Please wait while we secure your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col shadow-lg">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">AYUSH EHR</h3>
                <p className="text-xs text-slate-500">Doctor Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200/60">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.split(' ').map(n => n).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">{user.name}</div>
                <div className="text-xs text-slate-500">{user.specialty}</div>
                <div className="text-xs text-slate-400">ID: {user.identifier}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
                <p className="text-slate-500 mt-1">Comprehensive patient care system • FHIR R4 Compatible • Dual Coding</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.hospital}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n).join('')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                const colorClasses = {
                  blue: 'text-blue-600 bg-blue-50',
                  green: 'text-green-600 bg-green-50',
                  purple: 'text-purple-600 bg-purple-50',
                  orange: 'text-orange-600 bg-orange-50'
                }
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, ABHA ID, phone, or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="pending">Pending</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Patient List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Patient Records</h2>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {filteredPatients.length} patients
                    </span>
                  </div>
                </div>
              </div>

              {filteredPatients.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search criteria or filters.' : 'Start by adding your first patient to the system.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => {
                    const status = derivePatientStatus(patient)
                    const statusConfig = getStatusConfig(status)
                    const StatusIcon = statusConfig.icon
                    return (
                      <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-semibold text-blue-600">
                                {patient.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.class}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                  ABHA: {patient.abhaId}
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2 text-gray-400" />
                                  {patient.age} years, {patient.gender}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {patient.phone}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-start">
                                  <span className="text-sm font-medium text-gray-700 mr-2">Conditions:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {patient.conditions.map((c) => (
                                      <span key={c.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                        {c.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => setActivePatientId(activePatientId === patient.id ? null : patient.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {activePatientId === patient.id ? 'Hide' : 'View'} Details
                            </button>
                          </div>
                        </div>

                        {activePatientId === patient.id && (
                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">Current Prescriptions</h4>
                              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                                {patient.prescriptions.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">Notes</h4>
                              <p className="text-sm text-slate-700">{patient.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-900">ABHA Integration</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    All patient records are integrated with ABHA (Ayushman Bharat Health Account) for interoperability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
