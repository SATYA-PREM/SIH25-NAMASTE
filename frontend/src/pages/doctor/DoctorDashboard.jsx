import React, { useEffect, useMemo, useState } from 'react'
import { Search, FileText, Users, CalendarCheck, User, Bell, Settings, Download, Share2, Eye, EyeOff, ChevronDown, Activity, TrendingUp, Clock, Plus, Phone, MapPin } from 'lucide-react'

export default function DoctorDashboard() {
  const user = {
    identifier: 'DR-2001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    specialty: 'AYUSH Medicine',
    hospital: 'AIIMS Delhi'
  }

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activePatientId, setActivePatientId] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

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
            description: 'Acute fever with chills and body ache according to Ayurvedic classification',
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
            description: 'Type 2 diabetes mellitus with traditional medicine classification',
            severity: 'Mild',
            status: 'Under Treatment',
            symptoms: ['Excessive thirst', 'Frequent urination', 'Weight loss'],
            treatments: ['Bitter gourd', 'Fenugreek', 'Cinnamon'],
            prescribedDate: '2024-01-10',
            followUpDate: '2024-02-10'
          }
        ],
        vitalSigns: {
          bloodPressure: '140/90',
          heartRate: '85 bpm',
          temperature: '101.2°F',
          weight: '75 kg',
          height: '170 cm'
        },
        notes: 'Patient responding well to traditional medicine treatment. Continue current regimen and monitor blood sugar levels.',
        prescriptions: [
          'Giloy (Tinospora cordifolia) - 500mg twice daily',
          'Neem (Azadirachta indica) - 200mg once daily',
          'Turmeric (Curcuma longa) - 300mg with meals'
        ]
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
            description: 'Gastric acidity with burning sensation in chest and throat',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Heartburn', 'Acid reflux', 'Chest burning'],
            treatments: ['Amla', 'Licorice', 'Aloe vera'],
            prescribedDate: '2024-01-05',
            followUpDate: null
          }
        ],
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: '72 bpm',
          temperature: '98.6°F',
          weight: '62 kg',
          height: '165 cm'
        },
        notes: 'Condition resolved with traditional treatment. No further medication required.',
        prescriptions: [
          'Amla (Emblica officinalis) - 1 tsp with water',
          'Licorice - 200mg twice daily'
        ]
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
            description: 'Common cold with nasal congestion and mild cough',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Nasal congestion', 'Mild cough', 'Runny nose'],
            treatments: ['Honey', 'Ginger', 'Turmeric milk'],
            prescribedDate: '2024-01-01',
            followUpDate: null
          }
        ],
        vitalSigns: {
          bloodPressure: '110/70',
          heartRate: '68 bpm',
          temperature: '98.4°F',
          weight: '70 kg',
          height: '175 cm'
        },
        notes: 'Simple cold resolved within a week with natural remedies.',
        prescriptions: [
          'Honey with ginger - 1 tsp twice daily',
          'Turmeric milk before bedtime'
        ]
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
      (acc, p) => acc + p.conditions.filter((c) => c.status === 'Active' || c.status === 'Under Treatment').length,
      0
    )
    const resolved = patients.reduce(
      (acc, p) => acc + p.conditions.filter((c) => c.status === 'Resolved').length,
      0
    )
    const upcoming = patients.filter(p => p.nextAppointment).length
    return { total, active, resolved, upcoming }
  }, [patients])

  const filteredPatients = patients.filter((p) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.conditions.some((c) => c.name.toLowerCase().includes(q))
    )
  })

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, active: true },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Handle navigation clicks
  const handleNavClick = (itemId) => {
    if (itemId === 'patients') {
      window.location.href = '/Patients'
    } else {
      setActiveTab(itemId)
    }
  }

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
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col shadow-lg">
          {/* Brand Header */}
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200/60">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
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
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
                <p className="text-slate-500 mt-1">Comprehensive patient care system • FHIR R4 Compatible • Dual Coding</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.hospital}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Active Treatments</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{metrics.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Resolved Cases</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{metrics.resolved}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Upcoming Appointments</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.upcoming}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="flex items-center justify-center gap-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctors, diseases, organisation..."
                  className="w-180 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* New Patient Button */}
              <div>
                <button 
                  className="gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25"
                  onClick={() => (window.location.href = "/login")}
                >
                  + New Patient
                </button>
              </div>
            </div>

            {/* Enhanced Patients Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Patient Records</h2>
                <div className="text-sm text-slate-500">
                  {filteredPatients.length} of {patients.length} patients
                </div>
              </div>

              {filteredPatients.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No patients found</h3>
                  <p className="text-slate-500">Try adjusting your search criteria or add a new patient</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <article key={patient.id} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <header className="p-6 border-b border-slate-100/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-xl font-semibold text-slate-900">
                                {patient.name}
                              </h3>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                patient.priority === 'high' ? 'bg-red-100 text-red-700' :
                                patient.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {patient.priority} priority
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">{patient.age} years, {patient.gender}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">{patient.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">ABHA: {patient.abhaId}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {patient.nextAppointment && (
                            <div className="px-4 py-2 bg-emerald-100 rounded-lg text-sm font-medium text-emerald-700">
                              Next: {new Date(patient.nextAppointment).toLocaleDateString('en-IN')}
                            </div>
                          )}
                          <button
                            onClick={() => setActivePatientId(activePatientId === patient.id ? null : patient.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            {activePatientId === patient.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {activePatientId === patient.id ? 'Hide' : 'View'} Details
                          </button>
                        </div>
                      </div>
                    </header>

                    {activePatientId === patient.id && (
                      <div className="p-6 bg-slate-50/30">
                        {/* Vital Signs */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">Vital Signs</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {Object.entries(patient.vitalSigns).map(([key, value]) => (
                              <div key={key} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-lg font-semibold text-slate-900">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Conditions */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">Medical Conditions</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {patient.conditions.map((condition) => (
                              <div key={condition.id} className="bg-white border border-slate-200 rounded-xl p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-slate-900 mb-1">{condition.name}</h5>
                                    <div className="text-xs text-slate-500 space-x-2">
                                      <span>{condition.namasteCode}</span>
                                      <span>•</span>
                                      <span>{condition.icd11Code}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      condition.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                      condition.status === 'Active' ? 'bg-red-100 text-red-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                      {condition.status}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {condition.severity} severity
                                    </div>
                                  </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4">{condition.description}</p>

                                <div className="space-y-3">
                                  <div>
                                    <div className="text-xs font-medium text-slate-700 mb-2">Symptoms</div>
                                    <div className="flex flex-wrap gap-2">
                                      {condition.symptoms.map((symptom, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                                          {symptom}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium text-slate-700 mb-2">Current Treatment</div>
                                    <div className="text-sm text-slate-600">
                                      {condition.treatments.join(', ')}
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-xs text-slate-500">
                                    <span>Prescribed: {new Date(condition.prescribedDate).toLocaleDateString('en-IN')}</span>
                                    {condition.followUpDate && (
                                      <span>Follow-up: {new Date(condition.followUpDate).toLocaleDateString('en-IN')}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Prescriptions & Notes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <h5 className="font-semibold text-slate-900 mb-3">Current Prescriptions</h5>
                            <div className="space-y-2">
                              {patient.prescriptions.map((prescription, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-slate-700">{prescription}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-5">
                            <h5 className="font-semibold text-slate-900 mb-3">Clinical Notes</h5>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {patient.notes || 'No additional notes available.'}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                            <CalendarCheck className="w-4 h-4" />
                            Schedule Appointment
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25">
                            <Plus className="w-4 h-4" />
                            Add Diagnosis
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-600/25">
                            <Download className="w-4 h-4" />
                            Generate Report
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>🔒 End-to-end encrypted</span>
                <span>•</span>
                <span>FHIR R4 compatible</span>
                <span>•</span>
                <span>NAMASTE + ICD-11 TM2 dual coding</span>
                <span>•</span>
                <span>HIPAA compliant</span>
              </div>
              <div>
                Last updated: {new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
