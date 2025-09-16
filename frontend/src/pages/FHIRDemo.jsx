import React, { useState, useEffect } from 'react'
import { Search, Database, GitBranch, Package, CheckCircle, AlertCircle, Download, Upload, Eye, Code, Activity, FileText, Zap, Shield, Globe, Layers } from 'lucide-react'

// Mock FHIRTerminologySearch component for demo
const FHIRTerminologySearch = ({ selectedSystem }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Search className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">Terminology Search</h3>
        <p className="text-sm text-gray-600">
          Active system: {selectedSystem ? selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1) : 'All Systems'}
        </p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search NAMASTE terms (e.g., Jwara, Vata, Pitta...)"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-start space-x-3">
          <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Search & Translation Ready</p>
            <p className="text-sm text-gray-600 mt-1">
              Enter a term to search across NAMASTE taxonomies and get ICD-11 TM2 mappings
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Mock Navigation component
const Navigation = ({ children }) => <div className="min-h-screen bg-gray-50">{children}</div>

const FHIRDemo = () => {
  const [selectedSystem, setSelectedSystem] = useState(null)
  const [fhirResources, setFhirResources] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('search')

  const API_BASE = 'http://localhost:8000/api'

  const systems = [
    { id: null, name: 'All Systems', color: 'bg-gradient-to-r from-slate-500 to-slate-600', icon: Globe },
    { id: 'ayurveda', name: 'Ayurveda', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', icon: Layers },
    { id: 'siddha', name: 'Siddha', color: 'bg-gradient-to-r from-rose-500 to-rose-600', icon: Activity },
    { id: 'unani', name: 'Unani', color: 'bg-gradient-to-r from-amber-500 to-amber-600', icon: Shield },
  ]

  const tabs = [
    {
      id: 'search',
      name: 'Search & Translate',
      description: 'Search NAMASTE terms and translate to ICD-11',
      icon: Search,
      color: 'text-blue-600'
    },
    {
      id: 'codesystem',
      name: 'CodeSystem',
      description: 'View FHIR CodeSystems',
      icon: Database,
      color: 'text-purple-600'
    },
    {
      id: 'conceptmap',
      name: 'ConceptMap',
      description: 'NAMASTE ↔ ICD-11 mappings',
      icon: GitBranch,
      color: 'text-green-600'
    },
    {
      id: 'bundle',
      name: 'Bundle Demo',
      description: 'FHIR Bundle with double coding',
      icon: Package,
      color: 'text-orange-600'
    },
  ]

  useEffect(() => {
    if (activeTab !== 'search') {
      loadFHIRResources()
    }
  }, [activeTab])

  const loadFHIRResources = async () => {
    setLoading(true)
    try {
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (activeTab === 'codesystem') {
        setFhirResources({
          namaste: {
            url: 'http://terminology.ayush.gov.in/CodeSystem/namaste',
            version: '1.0.0',
            status: 'active',
            count: 15000,
            description: 'NAMASTE terminology system for traditional medicine systems'
          },
          icd11: {
            url: 'http://id.who.int/icd/release/11/2022-02/mms/tm2',
            version: '2022-02',
            status: 'active', 
            count: 8500,
            description: 'ICD-11 Traditional Medicine 2 classification system'
          }
        })
      } else if (activeTab === 'conceptmap') {
        setFhirResources({
          conceptmap: {
            url: 'http://terminology.ayush.gov.in/ConceptMap/namaste-to-icd11',
            version: '1.0.0',
            status: 'active',
            sourceCanonical: 'http://terminology.ayush.gov.in/CodeSystem/namaste',
            targetCanonical: 'http://id.who.int/icd/release/11/2022-02/mms/tm2',
            group: [{ element: [] }]
          }
        })
      }
    } catch (error) {
      console.error('Error loading FHIR resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleBundle = () => {
    return {
      resourceType: 'Bundle',
      id: 'ayush-emr-demo-bundle',
      type: 'transaction',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: 'urn:uuid:patient-demo-123',
          resource: {
            resourceType: 'Patient',
            id: 'patient-demo-123',
            identifier: [
              {
                system: 'http://abdm.gov.in/ABHA',
                value: '91-1234-5678-9012',
              },
            ],
            name: [
              {
                family: 'Sharma',
                given: ['Rajesh'],
              },
            ],
            gender: 'male',
            birthDate: '1985-06-15',
          },
          request: {
            method: 'POST',
            url: 'Patient',
          },
        },
        {
          fullUrl: 'urn:uuid:condition-demo-456',
          resource: {
            resourceType: 'Condition',
            id: 'condition-demo-456',
            clinicalStatus: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                  code: 'active',
                  display: 'Active',
                },
              ],
            },
            code: {
              coding: [
                {
                  system: 'http://terminology.ayush.gov.in/CodeSystem/namaste/ayurveda',
                  code: 'AYUR-FEVER-001',
                  display: 'Jwara (Fever)',
                },
                {
                  system: 'http://id.who.int/icd/release/11/2022-02/mms/tm2',
                  code: 'TM2-FEVER-001',
                  display: 'TM2: Fever pattern',
                },
              ],
              text: 'Jwara (Fever) with ICD-11 TM2 mapping',
            },
            subject: {
              reference: 'Patient/patient-demo-123',
            },
            onsetDateTime: new Date().toISOString(),
            recordedDate: new Date().toISOString(),
          },
          request: {
            method: 'POST',
            url: 'Condition',
          },
        },
      ],
    }
  }

  const uploadSampleBundle = async () => {
    try {
      setLoading(true)
      
      // Simulate bundle upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = {
        id: 'bundle-response-' + Date.now(),
        type: 'transaction-response',
        entry: [
          { response: { status: '201 Created', location: 'Patient/patient-demo-123' } },
          { response: { status: '201 Created', location: 'Condition/condition-demo-456' } }
        ]
      }
      
      setFhirResources({ bundle: result })
      
    } catch (error) {
      console.error('Bundle upload failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
      </div>
      <span className="ml-4 text-gray-600 font-medium">Loading...</span>
    </div>
  )

  const ResourceCard = ({ title, data, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-${color}-100 rounded-lg`}>
              <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
        </div>
        
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
              </span>
            </div>
          ))}
        </div>
        
        <button
          className={`mt-4 w-full bg-${color}-500 hover:bg-${color}-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2`}
          onClick={() => alert(JSON.stringify(data, null, 2))}
        >
          <Eye className="h-4 w-4" />
          <span>View JSON</span>
        </button>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Select Medical System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systems.map((system) => {
                  const IconComponent = system.icon
                  return (
                    <button
                      key={system.id || 'all'}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                        selectedSystem === system.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSystem(system.id)}
                    >
                      <div className={`w-12 h-12 ${system.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900">{system.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">Traditional System</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            <FHIRTerminologySearch selectedSystem={selectedSystem} />
          </div>
        )

      case 'codesystem':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">FHIR CodeSystems</h3>
            </div>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fhirResources.namaste && (
                  <ResourceCard
                    title="NAMASTE CodeSystem"
                    data={fhirResources.namaste}
                    icon={Database}
                    color="emerald"
                  />
                )}
                {fhirResources.icd11 && (
                  <ResourceCard
                    title="ICD-11 TM2 CodeSystem"
                    data={fhirResources.icd11}
                    icon={Globe}
                    color="blue"
                  />
                )}
              </div>
            )}
          </div>
        )

      case 'conceptmap':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <GitBranch className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">FHIR ConceptMap</h3>
            </div>
            
            {loading ? (
              <LoadingSpinner />
            ) : fhirResources.conceptmap ? (
              <ResourceCard
                title="NAMASTE ↔ ICD-11 TM2 Mapping"
                data={fhirResources.conceptmap}
                icon={GitBranch}
                color="green"
              />
            ) : (
              <div className="text-center py-16">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No ConceptMap data available</p>
              </div>
            )}
          </div>
        )

      case 'bundle':
        return (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">FHIR Bundle Demo</h3>
                <p className="text-gray-600 mt-1">Create FHIR Bundle with double-coded conditions (NAMASTE + ICD-11 TM2)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-8 border border-orange-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <button
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg flex items-center space-x-3 mx-auto"
                  onClick={uploadSampleBundle}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading Bundle...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate & Upload Sample Bundle</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {fhirResources.bundle && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Bundle Upload Successful</h4>
                    <p className="text-sm text-gray-600">FHIR Bundle processed successfully</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{fhirResources.bundle.entry?.length || 2}</p>
                      <p className="text-sm text-gray-600">Resources Created</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">201</p>
                      <p className="text-sm text-gray-600">HTTP Status</p>
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    onClick={() => alert(JSON.stringify(fhirResources.bundle, null, 2))}
                  >
                    <Code className="h-4 w-4" />
                    <span>View Response JSON</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Sample Bundle Structure</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Patient Resource</p>
                    <p className="text-sm text-gray-600">ABHA ID integration for Indian healthcare system</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Condition Resource with Double Coding</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>• Primary: NAMASTE code (Ayurveda/Siddha/Unani)</p>
                      <p>• Secondary: ICD-11 TM2 mapped code</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">FHIR R4 Compliant</p>
                    <p className="text-sm text-gray-600">Transaction bundle for atomic operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <Navigation>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              FHIR R4 Terminology Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced integration platform for NAMASTE and ICD-11 TM2 terminology systems with full FHIR R4 compliance
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex" aria-label="Tabs">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-6 px-4 text-center font-medium transition-all duration-200 relative ${
                        activeTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <IconComponent className={`h-5 w-5 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                        <div className="font-semibold">{tab.name}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-8">
              {renderTabContent()}
            </div>
          </div>

          {/* Compliance & Features */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">System Compliance & Features</h2>
              <p className="text-green-100">Built for healthcare interoperability and regulatory compliance</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'FHIR R4 Compliant', icon: CheckCircle },
                { label: 'NAMASTE Integration', icon: Database },
                { label: 'ICD-11 TM2 Mapping', icon: GitBranch },
                { label: 'Double Coding Support', icon: Code },
                { label: 'WHO API Ready', icon: Globe },
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors">
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">{feature.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  )
}

export default FHIRDemo