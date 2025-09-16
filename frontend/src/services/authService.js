import axios from 'axios'

// Backend API configuration
const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication service
export const authService = {
  // Generate OTP
  async generateOTP(identifier, userType = 'patient') {
    try {
      const response = await api.post('/auth/generate-otp', {
        identifier,
        user_type: userType,
      })
      return {
        success: true,
        data: response.data,
        otp: response.data.data?.otp, // For testing purposes
      }
    } catch (error) {
      console.error('OTP Generation Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to generate OTP',
      }
    }
  },

  // Verify OTP and login
  async verifyOTP(identifier, otpCode, userType = 'patient') {
    try {
      const response = await api.post('/auth/verify-otp', {
        identifier,
        otp_code: otpCode,
        user_type: userType,
      })

      if (response.data.access_token) {
        // Store auth data
        localStorage.setItem('authToken', response.data.access_token)
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            identifier,
            userType,
            loginTime: new Date().toISOString(),
          })
        )

        return {
          success: true,
          token: response.data.access_token,
          user: response.data.user_info || { identifier, userType },
        }
      }

      return {
        success: false,
        error: 'Invalid response from server',
      }
    } catch (error) {
      console.error('OTP Verification Error:', error)
      return {
        success: false,
        error:
          error.response?.data?.detail || 'Invalid OTP or verification failed',
      }
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    return { success: true }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken')
    const userInfo = localStorage.getItem('userInfo')
    return !!(token && userInfo)
  },

  // Get current user info
  getCurrentUser() {
    try {
      const userInfo = localStorage.getItem('userInfo')
      return userInfo ? JSON.parse(userInfo) : null
    } catch (error) {
      console.error('Error parsing user info:', error)
      return null
    }
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken')
  },
}

// FHIR service for terminology and medical data
export const fhirService = {
  // Search terminology
  async searchTerminology(term, limit = 10) {
    try {
      const response = await api.get('/fhir/terminology/search', {
        params: { term, limit },
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcl90eXBlIjoicGF0aWVudCIsImFiaGFfaWQiOiI5MS0xMjM0LTU2NzgtOTAxMiIsInNlc3Npb24iOiI2a1c3Y2pJQVhYMV9RZlZhelloVndwOEFDLXVPTXFDUl9YVDFEREx2dTNzIiwiZXhwIjoxNzU3NzcwNTk5fQ.hUV-82lqXb-PdbwAsG7OWsU9sETLc0DMUKl0-fa9uoU`,
        },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Terminology Search Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to search terminology',
      }
    }
  },

  // Get NAMASTE CodeSystem
  async getCodeSystem(system = 'namaste') {
    try {
      const response = await api.get(`/fhir/CodeSystem/${system}`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('CodeSystem Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch CodeSystem',
      }
    }
  },

  // Get ConceptMap
  async getConceptMap(mapId = 'namaste-to-icd11') {
    try {
      const response = await api.get(`/fhir/ConceptMap/${mapId}`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('ConceptMap Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch ConceptMap',
      }
    }
  },

  // Translate codes
  async translateCode(code, system, target) {
    try {
      const response = await api.post('/fhir/ConceptMap/$translate', {
        code,
        system,
        target,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Code Translation Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to translate code',
      }
    }
  },

  // Upload FHIR Bundle
  async uploadBundle(bundle) {
    try {
      const response = await api.post('/fhir/Bundle', bundle)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Bundle Upload Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to upload bundle',
      }
    }
  },

  // Expand ValueSet (auto-complete)
  async expandValueSet(url, filter = '') {
    try {
      const response = await api.get('/fhir/ValueSet/$expand', {
        params: { url, filter },
      })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('ValueSet Expansion Error:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to expand ValueSet',
      }
    }
  },
}

// Health service
export const healthService = {
  // Check backend health
  async checkHealth() {
    try {
      const response = await api.get('/health')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Health Check Error:', error)
      return {
        success: false,
        error: 'Backend service is not available',
      }
    }
  },

  // Get API info
  async getApiInfo() {
    try {
      const response = await api.get('/info')
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('API Info Error:', error)
      return {
        success: false,
        error: 'Failed to fetch API information',
      }
    }
  },
}

// Export the configured axios instance for custom requests
export { api }
export default authService
