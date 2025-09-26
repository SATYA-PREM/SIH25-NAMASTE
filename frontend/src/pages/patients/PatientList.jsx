import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Phone,
  Calendar,
  FileText,
  Eye,
  Filter,
  ChevronDown
} from 'lucide-react'

const PatientList = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock patient data for now
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        abhaId: '91-1234-5678-9012',
        name: 'Rajesh Kumar',
        age: 45,
        gender: 'Male',
        phone: '+91-9876543210',
        lastVisit: '2024-01-15',
        status: 'active',
        conditions: ['Hypertension', 'Diabetes Type 2'],
        practitioner: 'Dr. Ayurveda Specialist',
      },
      {
        id: 2,
        abhaId: '91-9876-5432-1098',
        name: 'Priya Sharma',
        age: 32,
        gender: 'Female',
        phone: '+91-8765432109',
        lastVisit: '2024-01-12',
        status: 'active',
        conditions: ['Migraine', 'Anxiety'],
        practitioner: 'Dr. Siddha Expert',
      },
      {
        id: 3,
        abhaId: '91-1111-2222-3333',
        name: 'Mohammed Ali',
        age: 58,
        gender: 'Male',
        phone: '+91-7654321098',
        lastVisit: '2024-01-10',
        status: 'inactive',
        conditions: ['Arthritis', 'High Cholesterol'],
        practitioner: 'Dr. Unani Physician',
      },
      {
        id: 4,
        abhaId: '91-4444-5555-6666',
        name: 'Sunitha Reddy',
        age: 29,
        gender: 'Female',
        phone: '+91-6543210987',
        lastVisit: '2024-01-08',
        status: 'pending',
        conditions: ['Stress Management'],
        practitioner: 'Dr. Yoga Therapist',
      },
    ]

    setTimeout(() => {
      setPatients(mockPatients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.abhaId.includes(searchTerm) ||
      patient.phone.includes(searchTerm)
    const matchesFilter =
      filterStatus === 'all' || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        icon: CheckCircle,
        class: 'bg-green-50 text-green-700 border-green-200',
        label: 'Active'
      },
      inactive: {
        icon: AlertCircle,
        class: 'bg-gray-50 text-gray-700 border-gray-200',
        label: 'Inactive'
      },
      pending: {
        icon: Clock,
        class: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Pending'
      },
    }
    return configs[status] || configs.pending
  }

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Patients',
      value: patients.filter(p => p.status === 'active').length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: "Today's Visits",
      value: 5,
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Pending Reviews',
      value: patients.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'orange'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Patients</h3>
            <p className="text-gray-600">Please wait while we fetch patient records...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage patient records with ABHA ID integration</p>
            </div>
            <button className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ABHA ID, or phone..."
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
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                {searchTerm 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Start by adding your first patient to the system.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => {
                const statusConfig = getStatusConfig(patient.status)
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
                                {patient.conditions.map((condition, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Practitioner:</span> {patient.practitioner}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">ABHA Integration</h3>
              <p className="mt-1 text-sm text-blue-700">
                All patient records are integrated with ABHA (Ayushman Bharat Health Account) for seamless healthcare data exchange and interoperability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientList