import React, { useRef } from 'react';
import { X, Printer, Calendar, User, Phone, FileText, Stethoscope } from 'lucide-react';

export default function PatientReportPage({ onClose, patients: propPatients }) {
  const componentRef = useRef();

  // Simple print function without react-to-print dependency
  const handlePrint = () => {
    window.print();
  };

  // Default patient data - use prop patients if provided, otherwise use default data
  const defaultPatients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      contact: '+91-9876543210',
      email: 'rajesh.kumar@email.com',
      ayushId: 'AYUSH-2024-001',
      address: 'New Delhi, India',
      bloodGroup: 'B+',
      diseases: [
        {
          name: 'Jwara (Fever)',
          systemName: 'Ayurveda System',
          namasteCode: 'NAMASTE-AYU-001',
          icd11Code: 'ICD11-TM2-001',
          diagnosedBy: 'Dr. Rajesh Kumar',
          specialty: 'Ayurveda Specialist',
          hospital: 'AIIMS Delhi - AYUSH Wing',
          diagnosedOn: '2024-01-15',
          status: 'Under Treatment',
          severity: 'Moderate',
          symptoms: ['High fever', 'Chills', 'Body ache', 'Headache'],
          treatment: 'Giloy (Tinospora cordifolia) - 500mg twice daily, Neem extract',
          nextVisit: '2024-02-15',
          notes: 'Patient responding well to traditional Ayurveda medicine treatment.'
        },
        {
          name: 'Madhumeha (Diabetes)',
          systemName: 'Ayurveda System',
          namasteCode: 'NAMASTE-AYU-045',
          icd11Code: 'ICD11-TM2-045',
          diagnosedBy: 'Dr. Priya Sharma',
          specialty: 'Ayurveda Medicine Expert',
          hospital: 'Government Ayurveda Hospital, Delhi',
          diagnosedOn: '2024-01-10',
          status: 'Stable',
          severity: 'Mild',
          symptoms: ['Excessive thirst', 'Frequent urination', 'Weight loss'],
          treatment: 'Bitter gourd juice, Fenugreek seeds, Cinnamon powder',
          nextVisit: '2024-02-10',
          notes: 'Blood sugar levels improving with herbal treatment.'
        },
      
        {
          name: 'Amlapitta (Acid Peptic Disease)',
          systemName: 'Siddha System',
          namasteCode: 'NAMASTE-SID-023',
          icd11Code: 'ICD11-TM2-023',
          diagnosedBy: 'Dr. Sunita Reddy',
          specialty: 'Siddha Medicine Consultant',
          hospital: 'Government Siddha Hospital, Chennai',
          diagnosedOn: '2024-01-12',
          status: 'Recovered',
          severity: 'Mild',
          symptoms: ['Heartburn', 'Acid reflux', 'Chest burning'],
          treatment: 'Amla (Emblica officinalis) - 1 tsp with water, Licorice root',
          nextVisit: 'Follow-up complete',
          notes: 'Condition completely resolved with Siddha treatment. No further medication required.'
        }
      ]
    }
  ];

  // Use prop patients if provided, otherwise use default patients
  const patients = propPatients || defaultPatients;

  // Debug log to help identify issues
  console.log('PatientReportPage - Total patients:', patients.length, patients);

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  // Add error boundary for patient data
  if (!patients || !Array.isArray(patients) || patients.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Available</h2>
          <p className="text-gray-600">Please ensure patient data is properly loaded.</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Print and Close buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AYUSH Health System Report</h1>
                <p className="text-lg text-gray-600">Comprehensive Patient Consultation Report</p>
                <p className="text-sm text-gray-500">Ministry of AYUSH • Government of India</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Report
              </button>
              <button
                onClick={handleGoBack}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div ref={componentRef} className="bg-white rounded-lg shadow-md p-8">
          {/* Report Header for Print */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-4xl font-bold text-green-700 mb-2">AYUSH Health System</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Patient Consultation Report</h2>
            <p className="text-gray-600">Traditional Medicine • Evidence-Based Care • Holistic Healing</p>
            <p className="text-sm text-gray-500 mt-2">Generated on: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="text-sm text-gray-500 mt-1">Total Patients: {patients.length}</p>
          </div>

          {/* Patient Records */}
          {patients.map((patient, index) => (
            <div key={patient.id} className="mb-10 border-b border-gray-200 pb-8 last:border-b-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patient Basic Information - Left Side */}
                <div className="lg:col-span-1">
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center mb-4">
                      <User className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-bold text-gray-900">Patient Information</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-green-700">{patient.name}</p>
                        <p className="text-sm text-gray-600">AYUSH ID: {patient.ayushId}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Age</p>
                          <p className="text-gray-900">{patient.age} years</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Gender</p>
                          <p className="text-gray-900">{patient.gender}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Blood Group</p>
                          <p className="text-gray-900">{patient.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Contact</p>
                          <p className="text-gray-900">{patient.contact}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Email</p>
                        <p className="text-gray-900 text-sm">{patient.email}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Address</p>
                        <p className="text-gray-900 text-sm">{patient.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History - Right Side */}
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-6">
                    <Stethoscope className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">Medical Consultation History</h3>
                  </div>

                  <div className="space-y-6">
                    {patient.diseases && patient.diseases.length > 0 ? (
                      patient.diseases.map((disease, diseaseIndex) => (
                        <div key={diseaseIndex} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-blue-800 mb-1">{disease.name}</h4>
                              <p className="text-sm text-blue-600 mb-2">
                                NAMASTE Code: {disease.namasteCode} • ICD-11: {disease.icd11Code}
                              </p>
                              <p className="text-xs text-blue-500 mb-2">System: {disease.systemName}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium ${
                                  disease.status === 'Recovered' ? 'bg-green-100 text-green-800' :
                                  disease.status === 'Under Treatment' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {disease.status}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  disease.severity === 'Mild' ? 'bg-green-100 text-green-700' :
                                  disease.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {disease.severity}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <div className="mb-2">
                                <p className="font-medium text-gray-700">Consulted By:</p>
                                <p className="text-gray-900">{disease.diagnosedBy}</p>
                                <p className="text-gray-600">{disease.specialty}</p>
                              </div>
                              <div className="mb-2">
                                <p className="font-medium text-gray-700">Hospital:</p>
                                <p className="text-gray-900 text-xs">{disease.hospital}</p>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Diagnosed: {new Date(disease.diagnosedOn).toLocaleDateString('en-IN')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Symptoms:</p>
                              <div className="flex flex-wrap gap-1">
                                {disease.symptoms && disease.symptoms.map((symptom, idx) => (
                                  <span key={idx} className="bg-white px-2 py-1 rounded text-xs text-gray-700 border">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-gray-700 mb-1">Next Visit:</p>
                              <p className="text-gray-900 text-sm">{disease.nextVisit}</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="font-medium text-gray-700 mb-1">Treatment Prescribed:</p>
                            <p className="text-gray-900 text-sm bg-white p-3 rounded border">
                              {disease.treatment}
                            </p>
                          </div>

                          <div className="mt-4">
                            <p className="font-medium text-gray-700 mb-1">Doctor's Notes:</p>
                            <p className="text-gray-900 text-sm bg-white p-3 rounded border italic">
                              {disease.notes}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-center">No medical consultation history available for this patient.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Report Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">AYUSH Health System</p>
                <p>Ministry of AYUSH • Government of India</p>
              </div>
              <div>
                <p>Report generated on: {new Date().toLocaleString('en-IN')}</p>
                <p className="text-xs mt-1">🔒 Confidential Medical Document</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
