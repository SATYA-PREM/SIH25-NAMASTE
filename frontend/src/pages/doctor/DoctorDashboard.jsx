import React, { useState, useEffect } from 'react'
import { Search, Plus, Users, CheckCircle, Clock, Activity, Filter, Calendar, Phone, User, FileText, Eye } from 'lucide-react'

function DoctorDashboard() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showAddDisease, setShowAddDisease] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDualCoding, setShowDualCoding] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Mock user data
  const user = { identifier: 'Sarah Johnson', specialty: 'AYUSH Medicine' }

  // Mock data for demonstration
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        abhaId: '91-1234-5678-9012',
        age: 45,
        gender: 'Male',
        phone: '+91-98765-43210',
        lastVisit: '2024-01-15',
        specialty: 'Ayurveda',
        conditions: [
          {
            id: 1,
            name: 'Jwara (Fever)',
            namasteCode: 'NAMASTE-001',
            icd11Code: 'ICD11-TM2-001',
            status: 'Active',
            severity: 'Moderate',
            lastUpdated: '2024-01-15',
          },
          {
            id: 2,
            name: 'Madhumeha (Diabetes)',
            namasteCode: 'NAMASTE-045',
            icd11Code: 'ICD11-TM2-045',
            status: 'Under Treatment',
            severity: 'Mild',
            lastUpdated: '2024-01-10',
          },
        ],
      },
      {
        id: 2,
        name: 'Priya Sharma',
        abhaId: '91-2345-6789-0123',
        age: 32,
        gender: 'Female',
        phone: '+91-87654-32109',
        lastVisit: '2024-01-10',
        specialty: 'Siddha',
        conditions: [
          {
            id: 3,
            name: 'Amlapitta (Acid Peptic Disease)',
            namasteCode: 'NAMASTE-023',
            icd11Code: 'ICD11-TM2-023',
            status: 'Resolved',
            severity: 'Mild',
            lastUpdated: '2024-01-05',
          },
        ],
      },
      {
        id: 3,
        name: 'Amit Singh',
        abhaId: '91-3456-7890-1234',
        age: 28,
        gender: 'Male',
        phone: '+91-76543-21098',
        lastVisit: '2024-01-08',
        specialty: 'Unani',
        conditions: [],
      },
    ]

    setTimeout(() => {
      setPatients(mockPatients)
      setLoading(false)
      setIsLoaded(true)
    }, 1000)
  }, [])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.abhaId.includes(searchTerm)
  )

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-red-50 text-red-700 border-red-200',
      'Under Treatment': 'bg-amber-50 text-amber-700 border-amber-200',
      'Resolved': 'bg-green-50 text-green-700 border-green-200'
    }
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      'Mild': 'bg-blue-50 text-blue-700 border-blue-200',
      'Moderate': 'bg-orange-50 text-orange-700 border-orange-200',
      'Severe': 'bg-red-50 text-red-700 border-red-200'
    }
    return styles[severity] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      change: '+12%',
      changeType: 'positive',
      color: 'blue'
    },
    {
      title: 'Resolved Cases',
      value: patients.reduce((acc, patient) => 
        acc + patient.conditions.filter(c => c.status === 'Resolved').length, 0
      ),
      icon: CheckCircle,
      change: '+8%',
      changeType: 'positive',
      color: 'green'
    },
    {
      title: 'Active Cases',
      value: patients.reduce((acc, patient) => 
        acc + patient.conditions.filter(c => 
          c.status === 'Active' || c.status === 'Under Treatment'
        ).length, 0
      ),
      icon: Clock,
      change: '+3%',
      changeType: 'positive',
      color: 'orange'
    },
    {
      title: 'Dual Coding',
      value: '100%',
      icon: Activity,
      change: 'Perfect',
      changeType: 'neutral',
      color: 'purple'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
            <p className="text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">AYUSH EMR</h1>
                <p className="text-sm text-gray-600">Professional Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dr. {user?.identifier}</p>
                <p className="text-xs text-gray-600">{user?.specialty}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'text-blue-600 bg-blue-50',
              green: 'text-green-600 bg-green-50',
              orange: 'text-orange-600 bg-orange-50',
              purple: 'text-purple-600 bg-purple-50'
            }
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients by name or ABHA ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button 
                onClick={() => setShowDualCoding(true)}
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Disease
              </button>
              <button className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Plus className="w-4 h-4 mr-2" />
                New Patient
              </button>
            </div>
          </div>
        </div>

        {/* Patients Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patient Records</h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first patient.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {patient.specialty}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {patient.age} years, {patient.gender}
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            ABHA: {patient.abhaId}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Conditions */}
                        {patient.conditions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Current Conditions</h4>
                            <div className="space-y-2">
                              {patient.conditions.slice(0, 2).map((condition) => (
                                <div key={condition.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-medium text-gray-900">{condition.name}</h5>
                                    <div className="flex space-x-2">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(condition.status)}`}>
                                        {condition.status}
                                      </span>
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(condition.severity)}`}>
                                        {condition.severity}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <p className="text-gray-500 font-medium">NAMASTE Code</p>
                                      <p className="font-mono text-gray-900">{condition.namasteCode}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 font-medium">ICD-11 TM2</p>
                                      <p className="font-mono text-gray-900">{condition.icd11Code}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {patient.conditions.length > 2 && (
                                <p className="text-sm text-gray-600">
                                  +{patient.conditions.length - 2} more conditions
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatient(patient)
                          setShowDualCoding(true)
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Disease
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">FHIR R4 Compliant</h3>
              <p className="mt-1 text-sm text-blue-700">
                This system uses FHIR R4 standards with dual coding (NAMASTE + ICD-11 TM2) for seamless integration with India's EHR Standards and global healthcare systems.
              </p>
            </div>
          </div>
        </div>

        {/* Dual Coding Modal Placeholder */}
        {showDualCoding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Disease Record</h3>
                  <button
                    onClick={() => {
                      setShowDualCoding(false)
                      setSelectedPatient(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  Patient: {selectedPatient?.name || 'New Patient'}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-center text-gray-600">Dual Coding Interface would be implemented here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard