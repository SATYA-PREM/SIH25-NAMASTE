import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

export default function Login() {
  const [formData, setFormData] = useState({
    abhaId: '',
    otp: '',
    userType: 'patient',
  })
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [otpGenerated, setOtpGenerated] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, generateOTP } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handleGenerateOTP = async () => {
  const patientId = formData.abhaId; // use whatever is entered
  if (!patientId) {
    setError('Please enter ABHA ID or Mobile Number');
    return;
  }
  setLoading(true);
  setError('');

  try {
    // Always use patient userType, even if doctor/admin is selected
    const result = await generateOTP(patientId, "patient");
    if (result.success) {
      setOtpGenerated(true);
      setGeneratedOtp(result.otp || '');
      setError('');
      if (result.otp) {
        setError(`OTP Generated: ${result.otp} (For testing only)`);
      } else {
        setError('OTP sent successfully!');
      }
    } else {
      setError(result.error || 'Failed to generate OTP');
    }
  } catch (error) {
    console.error('OTP generation error:', error);
    setError('Failed to generate OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!otpGenerated) {
    setError('Please generate OTP first');
    return;
  }
  if (!formData.otp) {
    setError('Please enter OTP');
    return;
  }
  setLoading(true);
  setError('');
  try {
    // Still always pass userType as "patient"
    await login({
      abhaId: formData.abhaId,
      otp: formData.otp,
      userType: "patient",
    });

    // Now use the user's dropdown to decide where to go
    if (formData.userType === "doctor") {
      navigate('/DoctorDashboard');
    } else if (formData.userType === "admin") {
      navigate('/govt');
    } else {
      navigate('/PatientDashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'Invalid OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const closeModal = () => {
    setIsModalOpen(false)
    navigate('/')
  }

  if (!isModalOpen) return null

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 hover:bg-white"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* ABHA ID Input */}
            <div>
              <label
                htmlFor="abhaId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                OTP
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  disabled={!otpGenerated}
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateOTP}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Generate OTP'
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  error.includes('Generated') || error.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-8 pb-8 bg-gray-50 rounded-b-2xl">
          <div className="flex space-x-3 mb-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !otpGenerated}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/AddPatient"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              New User? Register Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
