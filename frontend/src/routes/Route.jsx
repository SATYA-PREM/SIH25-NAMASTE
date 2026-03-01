import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PublicRoute from '../middleware/PublicRoute'
import ProtectedRoute from '../middleware/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AuthContextProvider from '../lib/AuthContext'
import FHIRDemo from '../pages/FHIRDemo'
import Govt from '../pages/user/Govt'
import Repo from '../pages/user/Repo'
import Company from '../pages/user/Company'


import PatientList from '../pages/patients/PatientList'
import AddPatient from '../pages/patients/AddPatient'
import AddPatient1 from '../pages/patients/AddPatient1'


import PatientDoctor from '../pages/auth/PatientDoctor'
import PatientLogin from '../pages/auth/PatientLogin'

import Analytics from '../pages/analytics/Analytics'
import PatientDashboard from '../pages/patient/PatientDashboard'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'

function Endpoint() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/AddPatient" element={<AddPatient />} />

                        


          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/govt" element={<Govt />} />
            <Route path="/company" element={<Company />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/PatientDashboard" element={<PatientDashboard />} />
            <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
            <Route path="/patientdoctor" element={<PatientDoctor />} />
            <Route path="/AddPatient1" element={<AddPatient1 />} />
                        <Route path="/Repo" element={<Repo />} />


            <Route path="/PatientLogin" element={<PatientLogin />} />
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
