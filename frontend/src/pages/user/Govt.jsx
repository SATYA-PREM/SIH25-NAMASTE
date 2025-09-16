import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  Activity, 
  Calendar, 
  MapPin, 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  BarChart3,
  Shield,
  Building
} from 'lucide-react'

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    // Mock data for government dashboard
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        specialty: 'Ayurveda',
        hospital: 'AIIMS Delhi',
        licenseNumber: 'AYUSH/DL/001',
        patientsCount: 45,
        experience: '15 years',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Dr. Priya Sharma',
        specialty: 'Siddha',
        hospital: 'Government Ayurveda Hospital, Mumbai',
        licenseNumber: 'AYUSH/MH/023',
        patientsCount: 32,
        experience: '12 years',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Dr. Arjun Menon',
        specialty: 'Unani',
        hospital: 'Kerala Ayurveda Center',
        licenseNumber: 'AYUSH/KL/045',
        patientsCount: 28,
        experience: '8 years',
        status: 'Active'
      },
      {
        id: 4,
        name: 'Dr. Sunita Reddy',
        specialty: 'Homeopathy',
        hospital: 'Government Homeopathy Hospital, Hyderabad',
        licenseNumber: 'AYUSH/TS/067',
        patientsCount: 38,
        experience: '10 years',
        status: 'Active'
      }
    ]

    const mockPatients = [
      {
        id: 101,
        patientId: 'PAT-2024-001',
        name: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        condition: 'Jwara (Fever)',
        treatmentSystem: 'Ayurveda',
        lastVisit: '2024-01-15',
        status: 'Under Treatment',
        doctorAssigned: 'Dr. Rajesh Kumar',
        hospital: 'AIIMS Delhi'
      },
      {
        id: 102,
        patientId: 'PAT-2024-002',
        name: 'Priya Sharma',
        age: 32,
        gender: 'Female',
        condition: 'Amlapitta (Acid Peptic Disease)',
        treatmentSystem: 'Siddha',
        lastVisit: '2024-01-10',
        status: 'Recovered',
        doctorAssigned: 'Dr. Priya Sharma',
        hospital: 'Government Ayurveda Hospital, Mumbai'
      },
      {
        id: 103,
        patientId: 'PAT-2024-003',
        name: 'Amit Singh',
        age: 28,
        gender: 'Male',
        condition: 'Nazla (Common Cold)',
        treatmentSystem: 'Unani',
        lastVisit: '2024-01-05',
        status: 'Recovered',
        doctorAssigned: 'Dr. Arjun Menon',
        hospital: 'Kerala Ayurveda Center'
      },
      {
        id: 104,
        patientId: 'PAT-2024-004',
        name: 'Meera Patel',
        age: 35,
        gender: 'Female',
        condition: 'Chronic Headache',
        treatmentSystem: 'Homeopathy',
        lastVisit: '2024-01-12',
        status: 'Under Treatment',
        doctorAssigned: 'Dr. Sunita Reddy',
        hospital: 'Government Homeopathy Hospital, Hyderabad'
      }
    ]

    setTimeout(() => {
      setDoctors(mockDoctors)
      setPatients(mockPatients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.treatmentSystem.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'doctors', label: 'Doctors Database', icon: UserCheck },
    { id: 'patients', label: 'Patients Database', icon: Users },
  ]

  const generatePatientReport = (patient) => {
    // Mock report generation
    alert(`Generating comprehensive health report for ${patient.name} (ID: ${patient.patientId})`)
  }

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Under Treatment': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Recovered': 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800">Loading Government Dashboard</h3>
          <p className="text-gray-600">Accessing AYUSH Healthcare Database...</p>
        </div>
      </div>
    )
  }

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-gray-900">{doctors.length}</p>
            </div>
            <UserCheck className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Treatments</p>
              <p className="text-3xl font-bold text-gray-900">
                {patients.filter(p => p.status === 'Under Treatment').length}
              </p>
            </div>
            <Activity className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
              <p className="text-3xl font-bold text-gray-900">75%</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">AYUSH Treatment Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ayurveda</span>
                <span className="text-sm font-medium">40%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Siddha</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unani</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Homeopathy</span>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Recent Activities</h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                • New patient registered: PAT-2024-005
              </div>
              <div className="text-sm text-gray-600">
                • Dr. Rajesh Kumar updated treatment protocol
              </div>
              <div className="text-sm text-gray-600">
                • 3 patients marked as recovered today
              </div>
              <div className="text-sm text-gray-600">
                • Monthly report generated successfully
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDoctorsList = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Registered AYUSH Practitioners</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {doctor.name.split(' ')[1]?.charAt(0) || doctor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                    <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.specialty} Specialist
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.hospital}
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        License: {doctor.licenseNumber}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.patientsCount} Active Patients
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">{doctor.experience} experience</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(doctor.status)}`}>
                        {doctor.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPatientsList = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Treatment Records</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-green-600">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                      <span className="text-sm text-gray-500">ID: {patient.patientId}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.age} years, {patient.gender}
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.condition}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.treatmentSystem} Treatment
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.doctorAssigned}
                      </div>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {patient.hospital}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => generatePatientReport(patient)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                </div>
              </div>

              {selectedPatient?.id === patient.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-3">Patient Treatment Details</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1"><strong>Patient ID:</strong> {patient.patientId}</p>
                      <p className="text-gray-600 mb-1"><strong>Condition:</strong> {patient.condition}</p>
                      <p className="text-gray-600 mb-1"><strong>Treatment System:</strong> {patient.treatmentSystem}</p>
                      <p className="text-gray-600 mb-1"><strong>Status:</strong> {patient.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1"><strong>Assigned Doctor:</strong> {patient.doctorAssigned}</p>
                      <p className="text-gray-600 mb-1"><strong>Hospital:</strong> {patient.hospital}</p>
                      <p className="text-gray-600 mb-1"><strong>Last Visit:</strong> {new Date(patient.lastVisit).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => generatePatientReport(patient)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Full Report
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                      <FileText className="w-4 h-4 mr-2 inline" />
                      View Treatment History
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview()
      case 'doctors':
        return renderDoctorsList()
      case 'patients':
        return renderPatientsList()
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Government AYUSH Dashboard</h1>
                <p className="text-sm text-gray-600">Ministry of Health & Family Welfare</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Healthcare Analytics Portal</p>
              <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="justify-around -mb-px flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === item.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
              {/* New Patient Button */}
              <div>
                <button 
                  className="gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25"
                  onClick={() => (window.location.href = "/Analytics")}
                >
                  Show Analytics
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        {(activeTab === 'doctors' || activeTab === 'patients') && (
          <div className="mb-6">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderContent()}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <p>© 2024 Government of India - Ministry of Health & Family Welfare</p>
              <p>AYUSH Healthcare Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>🔒 Secure Government Portal</span>
              <span>•</span>
              <span>FHIR R4 Compliant</span>
              <span>•</span>
              <span>Data Protection Certified</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
