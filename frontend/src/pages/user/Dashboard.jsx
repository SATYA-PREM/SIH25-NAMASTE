import React from 'react'
import { useAuth } from '../../lib/AuthContext'
import PatientDashboard from '../patient/PatientDashboard'
import DoctorDashboard from '../doctor/DoctorDashboard'

function Dashboard() {
  const { user } = useAuth()

  // Route users based on their role
  if (user?.userType === 'patient') {
    return <PatientDashboard />
  } else if (user?.userType === 'doctor') {
    return <DoctorDashboard />
  } else {
    // Default fallback for admin or unknown user types
    return <DoctorDashboard />
  }
}

export default Dashboard
