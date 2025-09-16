import React, { useState, useEffect } from 'react'

function DualCodingInterface({ patient, onClose, onSave }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedDisease, setSelectedDisease] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    severity: 'Mild',
    status: 'Active',
    notes: '',
    prescriptions: [],
  })

  // Mock disease data with NAMASTE and ICD-11 TM2 codes
  const mockDiseases = [
    {
      id: 1,
      name: 'Jwara (Fever)',
      namasteCode: 'NAMASTE-001',
      icd11Code: 'ICD11-TM2-001',
      description:
        'Acute fever with chills and body ache according to Ayurvedic classification',
      category: 'General Disorders',
      symptoms: ['Fever', 'Chills', 'Body ache', 'Headache', 'Fatigue'],
      treatments: ['Giloy', 'Neem', 'Tulsi', 'Ginger'],
      severity: 'Moderate',
      prevalence: 'High',
    },
    {
      id: 2,
      name: 'Madhumeha (Diabetes)',
      namasteCode: 'NAMASTE-045',
      icd11Code: 'ICD11-TM2-045',
      description:
        'Type 2 diabetes mellitus with traditional medicine classification',
      category: 'Metabolic Disorders',
      symptoms: [
        'Excessive thirst',
        'Frequent urination',
        'Weight loss',
        'Fatigue',
        'Blurred vision',
      ],
      treatments: ['Bitter gourd', 'Fenugreek', 'Cinnamon', 'Jamun'],
      severity: 'Moderate',
      prevalence: 'High',
    },
    {
      id: 3,
      name: 'Amlapitta (Acid Peptic Disease)',
      namasteCode: 'NAMASTE-023',
      icd11Code: 'ICD11-TM2-023',
      description: 'Gastric acidity with burning sensation in chest and throat',
      category: 'Digestive Disorders',
      symptoms: [
        'Heartburn',
        'Acid reflux',
        'Chest burning',
        'Nausea',
        'Bloating',
      ],
      treatments: ['Amla', 'Licorice', 'Aloe vera', 'Fennel'],
      severity: 'Mild',
      prevalence: 'Very High',
    },
    {
      id: 4,
      name: 'Vata Vyadhi (Neurological Disorders)',
      namasteCode: 'NAMASTE-067',
      icd11Code: 'ICD11-TM2-067',
      description: 'Disorders related to Vata dosha affecting nervous system',
      category: 'Neurological Disorders',
      symptoms: ['Tremors', 'Numbness', 'Pain', 'Weakness', 'Anxiety'],
      treatments: ['Ashwagandha', 'Brahmi', 'Shankhpushpi', 'Jatamansi'],
      severity: 'Moderate',
      prevalence: 'Medium',
    },
    {
      id: 5,
      name: 'Pitta Vyadhi (Inflammatory Conditions)',
      namasteCode: 'NAMASTE-034',
      icd11Code: 'ICD11-TM2-034',
      description: 'Inflammatory conditions related to Pitta dosha imbalance',
      category: 'Inflammatory Disorders',
      symptoms: [
        'Inflammation',
        'Heat sensation',
        'Redness',
        'Swelling',
        'Irritation',
      ],
      treatments: ['Turmeric', 'Neem', 'Aloe vera', 'Sandalwood'],
      severity: 'Moderate',
      prevalence: 'Medium',
    },
    {
      id: 6,
      name: 'Kapha Vyadhi (Respiratory Conditions)',
      namasteCode: 'NAMASTE-089',
      icd11Code: 'ICD11-TM2-089',
      description: 'Respiratory conditions related to Kapha dosha imbalance',
      category: 'Respiratory Disorders',
      symptoms: [
        'Cough',
        'Congestion',
        'Heaviness',
        'Mucus',
        'Breathing difficulty',
      ],
      treatments: ['Tulsi', 'Ginger', 'Honey', 'Black pepper'],
      severity: 'Mild',
      prevalence: 'High',
    },
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (searchTerm.length > 2) {
      setLoading(true)
      setTimeout(() => {
        const filtered = mockDiseases.filter(
          (disease) =>
            disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disease.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            disease.symptoms.some((symptom) =>
              symptom.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            disease.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setSearchResults(filtered)
        setLoading(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const handleDiseaseSelect = (disease) => {
    setSelectedDisease(disease)
    setSearchTerm(disease.name)
    setSearchResults([])
  }

  const handleSave = () => {
    if (selectedDisease) {
      const diseaseRecord = {
        ...selectedDisease,
        ...formData,
        patientId: patient.id,
        addedBy: 'Current Doctor',
        addedAt: new Date().toISOString(),
      }
      onSave(diseaseRecord)
    }
  }

  const addPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: [...prev.prescriptions, ''],
    }))
  }

  const updatePrescription = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((prescription, i) =>
        i === index ? value : prescription
      ),
    }))
  }

  const removePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6 rounded-t-3xl text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🔍</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dual Coding Interface</h2>
                <p className="text-blue-100 text-sm">
                  Patient: {patient?.name} ({patient?.abhaId})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Search Section */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-900 mb-4">
              Search Disease (NAMASTE + ICD-11 TM2)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Type disease name, symptoms, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-soft"
              />
              {loading && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                {searchResults.map((disease) => (
                  <div
                    key={disease.id}
                    onClick={() => handleDiseaseSelect(disease)}
                    className="p-6 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {disease.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {disease.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {disease.namasteCode}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                            {disease.icd11Code}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                            {disease.category}
                          </span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                            {disease.prevalence} Prevalence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Disease Details */}
          {selectedDisease && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </span>
                Selected Disease
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {selectedDisease.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {selectedDisease.description}
                  </p>

                  {/* Codes */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-sm font-bold text-blue-600 mb-2">
                        NAMASTE Code
                      </p>
                      <p className="text-lg font-mono text-gray-900 font-bold">
                        {selectedDisease.namasteCode}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                      <p className="text-sm font-bold text-green-600 mb-2">
                        ICD-11 TM2 Code
                      </p>
                      <p className="text-lg font-mono text-gray-900 font-bold">
                        {selectedDisease.icd11Code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-2">
                      Category
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {selectedDisease.category}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-2">
                      Severity Level
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {selectedDisease.severity}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-bold text-gray-600 mb-2">
                      Prevalence
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {selectedDisease.prevalence}
                    </p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mt-6">
                <h5 className="text-lg font-bold text-gray-900 mb-4">
                  Common Symptoms
                </h5>
                <div className="flex flex-wrap gap-3">
                  {selectedDisease.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Traditional Treatments */}
              <div className="mt-6">
                <h5 className="text-lg font-bold text-gray-900 mb-4">
                  Traditional Treatments
                </h5>
                <div className="flex flex-wrap gap-3">
                  {selectedDisease.treatments.map((treatment, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold"
                    >
                      {treatment}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          {selectedDisease && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Severity Level
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        severity: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-soft"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Treatment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-soft"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  Clinical Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={4}
                  placeholder="Enter clinical observations, treatment plan, and recommendations..."
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-soft"
                />
              </div>

              {/* Prescriptions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-bold text-gray-900">
                    Traditional Medicine Prescriptions
                  </label>
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="btn-primary px-6 py-3 text-sm font-bold rounded-xl"
                  >
                    <span className="relative z-10">+ Add Prescription</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.prescriptions.map((prescription, index) => (
                    <div key={index} className="flex space-x-4">
                      <input
                        type="text"
                        value={prescription}
                        onChange={(e) =>
                          updatePrescription(index, e.target.value)
                        }
                        placeholder="Enter prescription details (e.g., Herb name - dosage - frequency)"
                        className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-soft"
                      />
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-6 mt-12 pt-8 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedDisease}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <span className="relative z-10">Save Disease Record</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DualCodingInterface
