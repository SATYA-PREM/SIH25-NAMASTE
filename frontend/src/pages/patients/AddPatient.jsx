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
    constitution: '', // Prakriti for Ayurveda
    preferredTreatment: '',
    practitioner: '',
  })

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User, color: 'blue', description: 'Personal details and identification' },
    { id: 'address', label: 'Address', icon: MapPin, color: 'green', description: 'Residential and contact information' },
    { id: 'medical', label: 'Medical', icon: Heart, color: 'red', description: 'Medical history and emergency contacts' },
    { id: 'ayush', label: 'AYUSH', icon: Stethoscope, color: 'purple', description: 'Traditional medicine preferences' }
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
      // Mock search functionality
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
      // Validate required fields
      const requiredFields = ['name', 'abhaId', 'dateOfBirth', 'gender', 'phone']
      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`)
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Patient data:', formData)
      alert(`Patient ${formData.name} added successfully!`)
    } catch (err) {
      setError(err.message || 'Failed to add patient. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>Full Name <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="Enter patient's full name"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>ABHA ID <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            name="abhaId"
            value={formData.abhaId}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="XX-XXXX-XXXX-XXXX"
            pattern="[0-9]{2}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Date of Birth <span className="text-red-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
              required
            />
            {formData.dateOfBirth && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-green-600 font-medium">
                {calculateAge(formData.dateOfBirth)}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span>Phone Number <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="+91-XXXXXXXXXX"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder-gray-500"
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
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span>Address</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium resize-none placeholder-gray-500"
            placeholder="Enter complete address including house number, street, landmark"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="Enter state"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            PIN Code
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="XXXXXX"
            pattern="[0-9]{6}"
          />
        </div>
      </div>
    </div>
  )

  const renderMedical = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Blood Group</span>
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium"
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
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-red-500" />
            <span>Emergency Contact Name</span>
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="Emergency contact name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-red-500" />
            <span>Emergency Contact Phone</span>
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="+91-XXXXXXXXXX"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Known Allergies</span>
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium resize-none placeholder-gray-500"
            placeholder="List any known allergies, drug reactions, or food sensitivities..."
          />
        </div>

        <div className="lg:col-span-2">
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-red-500" />
            <span>Current Medications</span>
          </label>
          <textarea
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium resize-none placeholder-gray-500"
            placeholder="List current medications, dosages, and ongoing treatments..."
          />
        </div>
      </div>
    </div>
  )

  const renderAyush = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-purple-500" />
            <span>Constitution (Prakriti)</span>
          </label>
          <select
            name="constitution"
            value={formData.constitution}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
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
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Heart className="w-4 h-4 text-purple-500" />
            <span>Preferred Treatment System</span>
          </label>
          <select
            name="preferredTreatment"
            value={formData.preferredTreatment}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium"
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
          <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-purple-500" />
            <span>Assigned Practitioner</span>
          </label>
          <input
            type="text"
            name="practitioner"
            value={formData.practitioner}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium placeholder-gray-500"
            placeholder="Dr. [Name] - Practitioner specialization"
          />
        </div>

        {/* AYUSH Specific Additional Fields */}
        <div className="lg:col-span-2">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
              <Stethoscope className="w-4 h-4" />
              <span>Traditional Medicine Notes</span>
            </h4>
            <textarea
              name="ayushNotes"
              rows={3}
              className="w-full px-3 py-3 bg-white border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-500 resize-none"
              placeholder="Additional notes about traditional medicine preferences, previous AYUSH treatments, etc."
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
      {/* Professional Header */}
      <div className="bg-white shadow-lg border-b-2 border-gray-100">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors group">
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Patient Registration System
                </h1>
                <p className="text-gray-600 text-sm flex items-center space-x-4 mt-1">
                  <span>AYUSH Electronic Medical Records</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </span>
                  {savedData && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="flex items-center space-x-1 text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Auto-saved</span>
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* ABHA Search */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-3 border-2 border-gray-200">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by ABHA ID"
                  value={searchAbha}
                  onChange={(e) => setSearchAbha(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-48 font-medium"
                />
                <button
                  onClick={searchPatientByAbha}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
              <div className="text-right bg-blue-50 px-6 py-3 rounded-xl border-2 border-blue-200">
                <div className="text-xs text-blue-600 font-bold">Registration ID</div>
                <div className="font-mono text-lg font-bold text-blue-900">
                  REG-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Enhanced Sidebar */}
        <div className="w-96 bg-white shadow-2xl border-r-2 border-gray-200 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                Registration Steps
              </h3>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Secure</span>
              </div>
            </div>
            <div className="space-y-4">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isCompleted = validateTab(tab.id)
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-xl shadow-${tab.color}-200 border-2 border-${tab.color}-400`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-lg border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isActive 
                          ? 'bg-white bg-opacity-25' 
                          : `bg-${tab.color}-100`
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isActive 
                            ? 'text-white' 
                            : `text-${tab.color}-600`
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base">{tab.label}</div>
                        <div className={`text-sm ${
                          isActive ? 'text-white text-opacity-90' : 'text-gray-500'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`text-sm px-3 py-1 rounded-full font-bold ${
                        isActive ? 'bg-white bg-opacity-25 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      {isCompleted && (
                        <CheckCircle className={`w-6 h-6 ${
                          isActive ? 'text-white' : 'text-green-500'
                        }`} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-bold text-gray-900">
                  Progress Overview
                </div>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Completed Steps</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {tabs.filter(tab => validateTab(tab.id)).length}/{tabs.length}
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-700 shadow-inner"
                    style={{ 
                      width: `${(tabs.filter(tab => validateTab(tab.id)).length / tabs.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {tabs.filter(tab => validateTab(tab.id)).length === tabs.length 
                    ? '✅ Ready to register patient' 
                    : '⏳ Complete all required fields'
                  }
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 text-sm font-semibold border-2 border-blue-200">
                <Plus className="w-4 h-4" />
                <span>Add Medical History</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-200 text-sm font-semibold border-2 border-green-200">
                <FileText className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Current Tab Content */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-10 mb-8">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label} Information
                  </h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    validateTab(activeTab) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {validateTab(activeTab) ? 'Complete' : 'In Progress'}
                  </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-32 mb-2"></div>
                <p className="text-gray-600 text-lg">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              {renderTabContent()}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800">Registration Error</h3>
                    <p className="text-sm text-red-700 font-medium mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].id)
                      }
                    }}
                    disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                    className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
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
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 hover:shadow-lg"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registering Patient...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
                        <span>Register Patient</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Registration Summary */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {formData.name ? '✓' : '○'}
                    </div>
                    <div className="text-sm font-medium text-blue-800">Patient Name</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {formData.abhaId ? '✓' : '○'}
                    </div>
                    <div className="text-sm font-medium text-green-800">ABHA ID</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                      {formData.phone ? '✓' : '○'}
                    </div>
                    <div className="text-sm font-medium text-purple-800">Contact Info</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {formData.constitution ? '✓' : '○'}
                    </div>
                    <div className="text-sm font-medium text-orange-800">AYUSH Data</div>
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