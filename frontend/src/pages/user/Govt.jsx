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
  Building,
  LogOut,
  // Added Analytics imports
  TrendingUp,
  PieChart,
  Lightbulb,
  ChevronDown
} from 'lucide-react'

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  
  // Analytics state
  const [timeRange, setTimeRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    commonConditions: [],
    treatmentTypes: [],
    monthlyTrends: [],
    geographicDistribution: [],
  })

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

    // Analytics mock data
    const mockAnalyticsData = {
      totalPatients: 1247,
      totalConsultations: 3892,
      avgConsultationsPerPatient: 3.1,
      recoveryRate: 87.3,
      commonConditions: [
        { name: 'Hypertension', count: 234, percentage: 18.8, trend: '+5%', trendType: 'positive' },
        { name: 'Diabetes Type 2', count: 189, percentage: 15.2, trend: '+3%', trendType: 'positive' },
        { name: 'Arthritis', count: 156, percentage: 12.5, trend: '+8%', trendType: 'positive' },
        { name: 'Migraine', count: 134, percentage: 10.7, trend: '-2%', trendType: 'negative' },
        { name: 'Anxiety Disorders', count: 98, percentage: 7.9, trend: '+12%', trendType: 'positive' },
      ],
      treatmentTypes: [
        { name: 'Ayurveda', count: 567, percentage: 45.5, color: 'bg-emerald-500' },
        { name: 'Siddha', count: 312, percentage: 25.0, color: 'bg-blue-500' },
        { name: 'Unani', count: 234, percentage: 18.8, color: 'bg-purple-500' },
        { name: 'Homeopathy', count: 134, percentage: 10.7, color: 'bg-orange-500' },
      ],
      monthlyTrends: [
        { month: 'Jan', patients: 89, consultations: 234 },
        { month: 'Feb', patients: 102, consultations: 289 },
        { month: 'Mar', patients: 156, consultations: 356 },
        { month: 'Apr', patients: 134, consultations: 398 },
        { month: 'May', patients: 178, consultations: 445 },
        { month: 'Jun', patients: 203, consultations: 512 },
      ],
      geographicDistribution: [
        { state: 'Maharashtra', patients: 234, percentage: 18.8 },
        { state: 'Tamil Nadu', patients: 189, percentage: 15.2 },
        { state: 'Karnataka', patients: 156, percentage: 12.5 },
        { state: 'Kerala', patients: 134, percentage: 10.7 },
        { state: 'Gujarat', patients: 98, percentage: 7.9 },
      ],
    }

    setTimeout(() => {
      setDoctors(mockDoctors)
      setPatients(mockPatients)
      setAnalyticsData(mockAnalyticsData)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  // Logout function
  const handleLogout = () => {
    try {
      const confirmed = window.confirm('Are you sure you want to logout from Government Portal?');
      if (!confirmed) return;

      console.log('Logging out from Government Dashboard');

      localStorage.clear();
      sessionStorage.clear();
      
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }

      setDoctors([]);
      setPatients([]);
      setSearchQuery('');
      setSelectedPatient(null);
      setActiveTab('dashboard');

      alert('Successfully logged out from Government Portal!');
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

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

  // Updated navigation items with Analytics tab (removed Show Analytics button)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { id: 'doctors', label: 'Doctors Database', icon: UserCheck },
    { id: 'patients', label: 'Patients Database', icon: Users },
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp }, // New Analytics tab
  ]

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ]

  const generatePatientReport = (patient) => {
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

  // New Analytics render function
  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analyticsData.totalPatients?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consultations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analyticsData.totalConsultations?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Consultations/Patient</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analyticsData.avgConsultationsPerPatient || '0'}
              </p>
              <p className="text-sm text-blue-600 mt-1">+0.3 from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analyticsData.recoveryRate}%
              </p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Common Conditions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Activity className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Most Common Conditions</h2>
          </div>
          <div className="space-y-4">
            {analyticsData.commonConditions?.map((condition, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{condition.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{condition.count} patients</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      condition.trendType === 'positive' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {condition.trend}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${condition.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{condition.percentage}% of total</span>
                </div>
              </div>
            )) || []}
          </div>
        </div>

        {/* Treatment Types Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <PieChart className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Treatment Types Distribution</h2>
          </div>
          <div className="space-y-4 mb-6">
            {analyticsData.treatmentTypes?.map((treatment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${treatment.color} rounded-full mr-3`} />
                  <span className="text-sm font-medium text-gray-900">{treatment.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{treatment.count} patients</span>
                  <span className="text-sm font-medium text-gray-900">{treatment.percentage}%</span>
                </div>
              </div>
            )) || []}
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
            {analyticsData.treatmentTypes?.map((treatment, index) => (
              <div
                key={index}
                className={treatment.color}
                style={{ width: `${treatment.percentage}%` }}
              />
            )) || []}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Geographic Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {analyticsData.geographicDistribution?.map((location, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{location.state}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">{location.patients}</p>
              <p className="text-sm text-gray-600 mb-3">{location.percentage}% of total</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${location.percentage}%` }}
                />
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Calendar className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analyticsData.monthlyTrends?.map((month, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:shadow-sm transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-3">{month.month}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">New Patients</p>
                  <p className="text-lg font-bold text-blue-600">{month.patients}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Consultations</p>
                  <p className="text-lg font-bold text-green-600">{month.consultations}</p>
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Pattern Recognition</h3>
            <p className="text-sm text-gray-700">
              Hypertension shows highest prevalence in traditional medicine consultations, 
              suggesting effective AYUSH treatments for cardiovascular conditions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Growth Trend</h3>
            <p className="text-sm text-gray-700">
              Anxiety disorder treatments have increased by 12%, indicating growing 
              acceptance of traditional medicine for mental health conditions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Regional Preference</h3>
            <p className="text-sm text-gray-700">
              Maharashtra leads in AYUSH adoption, followed by Tamil Nadu and Karnataka, 
              showing strong regional cultural alignment with traditional medicine.
            </p>
          </div>
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
      case 'analytics':
        return renderAnalytics() // New analytics case
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Updated Header with Logout Button */}
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
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">Healthcare Analytics Portal</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs - Analytics button removed, Analytics tab added */}
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
