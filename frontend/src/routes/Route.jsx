import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicRoute from '../middleware/PublicRoute'
import ProtectedRoute from '../middleware/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AuthContextProvider from '../lib/AuthContext'
import Dashboard from '../pages/user/Dashboard'
import FHIRDemo from '../pages/FHIRDemo'
import PatientList from '../pages/patients/PatientList'
import AddPatient from '../pages/patients/AddPatient'
import Analytics from '../pages/analytics/Analytics'
import PatientDashboard from '../pages/patient/PatientDashboard'

function Endpoint() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/PatientDashboard" element={<PatientDashboard/>} />
            <Route path="/patients/add" element={<AddPatient />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fhir-demo" element={<FHIRDemo />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route element={<ProtectedRoute />}>
          </Route>
        </Routes>
      </AuthContextProvider>
    </Router>
  )
}

export default Endpoint
