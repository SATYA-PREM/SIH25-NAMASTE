import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function PatientDoctorWithConsent() {
  const [showPopup, setShowPopup] = useState(true)
  const [formData, setFormData] = useState({ abhaId: '', otp: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = () => {
    if (!formData.abhaId || !formData.otp) {
      alert('Please enter ABHA ID and OTP')
      return
    }
    setShowPopup(false)
  }

  const handleRegister = () => {
    navigate('/register')
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6 rounded-t-2xl text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                className="text-white"
              >
                <path
                  d="M20 12L28 16V24C28 26.2091 24.4183 28 20 28C15.5817 28 12 26.2091 12 24V16L20 12Z"
                  fill="currentColor"
                />
                <circle cx="20" cy="20" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AYUSH EHR</h2>
              <p className="text-blue-100 text-sm">Secure Login Portal</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleLogin()
            }}
            className="space-y-6"
          >
            {/* ABHA ID Input */}
            <div>
              <label htmlFor="abhaId" className="block text-sm font-medium text-gray-700 mb-2">
                ABHA ID / Mobile Number
              </label>
              <input
                type="text"
                id="abhaId"
                name="abhaId"
                value={formData.abhaId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 hover:bg-white"
                placeholder="Enter ABHA ID or Mobile Number"
                required
              />
            </div>

            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 hover:bg-white"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>

            {/* Login Button */}
            <div className="flex space-x-3">
              <button
                type="submit"
                              onClick={() => (window.location.href = "PatientDoctor")}

                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Login
              </button>

              {/* Register Button */}
              <button
                type="button"
                              onClick={() => (window.location.href = "AddPatient1")}

                className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
