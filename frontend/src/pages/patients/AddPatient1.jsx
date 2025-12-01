import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, MapPin, Heart, Stethoscope, Save, X, AlertCircle, CheckCircle, Clock, Shield, Phone, Mail, Calendar, FileText, Search, Plus } from 'lucide-react'

const AddPatient = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [savedData, setSavedData] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchAbha, setSearchAbha] = useState('')
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    abhaId: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',

    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Medical Information
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    currentMedications: '',

    // AYUSH Specific
    constitution: '',
    preferredTreatment: '',
    practitioner: '',
    ayushNotes: ''
  })

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User, description: 'Personal details and identification' },
    { id: 'address', label: 'Address', icon: MapPin, description: 'Residential and contact information' },
    { id: 'medical', label: 'Medical', icon: Heart, description: 'Medical history and emergency contacts' },
    { id: 'ayush', label: 'AYUSH', icon: Stethoscope, description: 'Traditional medicine preferences' }
  ]

  // Auto-save functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-save draft
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (Object.values(formData).some(value => value.trim() !== '')) {
        setSavedData(true)
        setTimeout(() => setSavedData(false), 2000)
      }
    }, 3000)
    return () => clearTimeout(autoSave)
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const searchPatientByAbha = () => {
    if (searchAbha) {
      setFormData(prev => ({ ...prev, abhaId: searchAbha }))
      setSearchAbha('')
      alert('ABHA ID verified and linked')
    }
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ''
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age > 0 ? `${age} years old` : 'Invalid date'
  }

  const validateTab = (tabId) => {
    const requiredFields = {
      basic: ['name', 'abhaId', 'dateOfBirth', 'gender', 'phone'],
      address: [],
      medical: [],
      ayush: []
    }
    
    const fields = requiredFields[tabId] || []
    return fields.every(field => formData[field])
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const requiredFields = ['name', 'abhaId', 'dateOfBirth', 'gender', 'phone']
      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Patient data:', formData)
      alert(`Patient ${formData.name} added successfully!`)
    } catch (err) {
      setError(err.message || 'Failed to add patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTabColorClasses = (tabId, isActive) => {
    const colors = {
      basic: {
        active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200',
        inactive: 'bg-blue-100 text-blue-600',
        icon: 'text-blue-600'
      },
      address: {
        active: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200',
        inactive: 'bg-green-100 text-green-600',
        icon: 'text-green-600'
      },
      medical: {
        active: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200',
        inactive: 'bg-red-100 text-red-600',
        icon: 'text-red-600'
      },
      ayush: {
        active: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200',
        inactive: 'bg-purple-100 text-purple-600',
        icon: 'text-purple-600'
      }
    }
    return colors[tabId] || colors.basic
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="Enter patient's full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            ABHA ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="abhaId"
            value={formData.abhaId}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="XX-XXXX-XXXX-XXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
              required
            />
            {formData.dateOfBirth && (
              <div className="mt-1 text-sm text-green-600 font-medium">
                {calculateAge(formData.dateOfBirth)}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="+91-XXXXXXXXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="patient@example.com"
          />
        </div>
      </div>
    </div>
  )

  const renderAddress = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 resize-none placeholder-gray-400"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="Enter state"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            PIN Code
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="XXXXXX"
          />
        </div>
      </div>
    </div>
  )

  const renderMedical = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="Emergency contact name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="+91-XXXXXXXXXX"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Known Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 resize-none placeholder-gray-400"
            placeholder="List any known allergies..."
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Current Medications
          </label>
          <textarea
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 resize-none placeholder-gray-400"
            placeholder="List current medications..."
          />
        </div>
      </div>
    </div>
  )

  const renderAyush = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Constitution (Prakriti)
          </label>
          <select
            name="constitution"
            value={formData.constitution}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900"
          >
            <option value="">Select Constitution</option>
            <option value="Vata">Vata (Air & Space)</option>
            <option value="Pitta">Pitta (Fire & Water)</option>
            <option value="Kapha">Kapha (Earth & Water)</option>
            <option value="Vata-Pitta">Vata-Pitta</option>
            <option value="Pitta-Kapha">Pitta-Kapha</option>
            <option value="Vata-Kapha">Vata-Kapha</option>
            <option value="Tridosha">Tridosha (Balanced)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Preferred Treatment System
          </label>
          <select
            name="preferredTreatment"
            value={formData.preferredTreatment}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900"
          >
            <option value="">Select Treatment System</option>
            <option value="Ayurveda">Ayurveda</option>
            <option value="Yoga">Yoga & Naturopathy</option>
            <option value="Unani">Unani Medicine</option>
            <option value="Siddha">Siddha Medicine</option>
            <option value="Homeopathy">Homeopathy</option>
            <option value="Integrated">Integrated Approach</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Assigned Practitioner
          </label>
          <input
            type="text"
            name="practitioner"
            value={formData.practitioner}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400"
            placeholder="Dr. [Name] - Practitioner specialization"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-3">
              Traditional Medicine Notes
            </h4>
            <textarea
              name="ayushNotes"
              value={formData.ayushNotes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-3 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400 resize-none"
              placeholder="Additional notes about traditional medicine preferences..."
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo()
      case 'address':
        return renderAddress()
      case 'medical':
        return renderMedical()
      case 'ayush':
        return renderAyush()
      default:
        return renderBasicInfo()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Patient Registration System
                </h1>
                <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                  <span>AYUSH Electronic Medical Records</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-4 h-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                  {savedData && (
                    <>
                      <span className="text-gray-400">•</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Auto-saved</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* ABHA Search */}
              <div className="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search by ABHA ID"
                  value={searchAbha}
                  onChange={(e) => setSearchAbha(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-40"
                />
                <button
                  onClick={searchPatientByAbha}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
              
              <div className="text-right bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-semibold">Registration ID</div>
                <div className="font-mono text-sm font-bold text-blue-900">
                  REG-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg border-r border-gray-200 fixed h-full overflow-y-auto z-40">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Registration Steps</h3>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-600">Secure</span>
              </div>
            </div>

            <div className="space-y-3">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isCompleted = validateTab(tab.id)
                const isActive = activeTab === tab.id
                const colorClasses = getTabColorClasses(tab.id, isActive)
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 border-2 ${
                      isActive
                        ? `${colorClasses.active} border-transparent`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-white bg-opacity-25' 
                          : colorClasses.inactive
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive 
                            ? 'text-white' 
                            : colorClasses.icon
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{tab.label}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-white opacity-90' : 'text-gray-500'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        isActive ? 'bg-white bg-opacity-25 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      {isCompleted && (
                        <CheckCircle className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-green-500'
                        }`} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Progress */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-900">Progress Overview</div>
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed Steps</span>
                  <span className="font-semibold text-gray-900">
                    {tabs.filter(tab => validateTab(tab.id)).length}/{tabs.length}
                  </span>
                </div>
                
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(tabs.filter(tab => validateTab(tab.id)).length / tabs.length) * 100}%` 
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-600">
                  {tabs.filter(tab => validateTab(tab.id)).length === tabs.length 
                    ? '✅ Ready to register patient' 
                    : '⏳ Complete all required fields'
                  }
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium border border-blue-200">
                <Plus className="w-4 h-4" />
                <span>Add Medical History</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium border border-green-200">
                <FileText className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80 min-h-screen">
          <div className="max-w-4xl mx-auto p-6">
            {/* Current Tab Content */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label} Information
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    validateTab(activeTab) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {validateTab(activeTab) ? 'Complete' : 'In Progress'}
                  </div>
                </div>
                <p className="text-gray-600">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              {renderTabContent()}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Registration Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].id)
                      }
                    }}
                    disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id)
                      }
                    }}
                    disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => (window.location.href = "patientdoctor")}

                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Register Patient</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Registration Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {formData.name ? '✓' : '○'}
                    </div>
                    <div className="text-xs font-medium text-blue-800">Patient Name</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {formData.abhaId ? '✓' : '○'}
                    </div>
                    <div className="text-xs font-medium text-green-800">ABHA ID</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {formData.phone ? '✓' : '○'}
                    </div>
                    <div className="text-xs font-medium text-purple-800">Contact Info</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-lg font-bold text-orange-600 mb-1">
                      {formData.constitution ? '✓' : '○'}
                    </div>
                    <div className="text-xs font-medium text-orange-800">AYUSH Data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPatient
