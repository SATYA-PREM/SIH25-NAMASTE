import React, { useEffect, useMemo, useState } from 'react';
import { 
  Search, FileText, Users, CalendarCheck, User, Bell, Settings, 
  Download, Share2, Eye, EyeOff, ChevronDown, Activity, TrendingUp, 
  Clock, Plus, X, Heart, MessageCircle, Pill, ArrowLeft 
} from 'lucide-react';

export default function PatientDoctor() {
  // User information
  const user = {
    identifier: 'P-1001',
    name: 'Rajesh kumar', 
    email: 'rajesh.kumar@gmail.com'
  };

  // Existing state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeReportId, setActiveReportId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // New state for diseases functionality
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState(new Set());
  const [diseaseQuery, setDiseaseQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('all');
  const [selectedDiseaseDetail, setSelectedDiseaseDetail] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState('');

  // Initialize with mock reports
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        date: '2024-01-15',
        doctor: 'Dr. Rajesh Kumar',
        hospital: 'AIIMS Delhi',
        specialty: 'Ayurveda',
        reportType: 'Comprehensive Consultation',
        priority: 'high',
        diagnosis: [
          {
            id: 1,
            name: 'Jwara (Fever)',
            namasteCode: 'NAMASTE-001',
            icd11Code: 'ICD11-TM2-001',
            description: 'Acute fever with chills and body ache according to Ayurvedic classification',
            severity: 'Moderate',
            status: 'Active',
            symptoms: ['Fever', 'Chills', 'Body ache', 'Headache'],
            treatments: ['Giloy', 'Neem', 'Tulsi'],
          },
          {
            id: 2,
            name: 'Madhumeha (Diabetes)',
            namasteCode: 'NAMASTE-045',
            icd11Code: 'ICD11-TM2-045',
            description: 'Type 2 diabetes mellitus with traditional medicine classification',
            severity: 'Mild',
            status: 'Under Treatment',
            symptoms: ['Excessive thirst', 'Frequent urination', 'Weight loss'],
            treatments: ['Bitter gourd', 'Fenugreek', 'Cinnamon'],
          }
        ],
        prescriptions: [
          'Giloy (Tinospora cordifolia) - 500mg twice daily',
          'Neem (Azadirachta indica) - 200mg once daily',
          'Turmeric (Curcuma longa) - 300mg with meals',
        ],
        notes: 'Patient responding well to traditional medicine treatment. Continue current regimen.',
        followUp: '2024-02-15',
      },
      {
        id: 2,
        date: '2024-01-10',
        doctor: 'Dr. Priya Sharma',
        hospital: 'Ayurveda Hospital',
        specialty: 'Siddha',
        reportType: 'Follow-up Assessment',
        priority: 'medium',
        diagnosis: [
          {
            id: 3,
            name: 'Amlapitta (Acid Peptic Disease)',
            namasteCode: 'NAMASTE-023',
            icd11Code: 'ICD11-TM2-023',
            description: 'Gastric acidity with burning sensation in chest and throat',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Heartburn', 'Acid reflux', 'Chest burning'],
            treatments: ['Amla', 'Licorice', 'Aloe vera'],
          }
        ],
        prescriptions: [
          'Amla (Emblica officinalis) - 1 tsp with water',
          'Licorice - 200mg twice daily',
        ],
        notes: 'Condition resolved with traditional treatment. No further medication required.',
        followUp: null,
      },
      {
        id: 3,
        date: '2024-01-05',
        doctor: 'Dr. Arjun Menon',
        hospital: 'Kerala Ayurveda Center',
        specialty: 'Unani',
        reportType: 'Initial Consultation',
        priority: 'low',
        diagnosis: [
          {
            id: 4,
            name: 'Nazla (Common Cold)',
            namasteCode: 'NAMASTE-012',
            icd11Code: 'ICD11-TM2-012',
            description: 'Common cold with nasal congestion and mild cough',
            severity: 'Mild',
            status: 'Resolved',
            symptoms: ['Nasal congestion', 'Mild cough', 'Runny nose'],
            treatments: ['Honey', 'Ginger', 'Turmeric milk'],
          }
        ],
        prescriptions: [
          'Honey with ginger - 1 tsp twice daily',
          'Turmeric milk before bedtime',
        ],
        notes: 'Simple cold resolved within a week with natural remedies.',
        followUp: null,
      }
    ];

    const timer = setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced navigation handler with back functionality
  const handleNavigation = (tabId) => {
    if (tabId === 'back') {
      // Handle back navigation
      //window.history.back();
      // Alternative: go to a specific URL
      window.location.href = "DoctorDashboard";
    } else {
      setActiveTab(tabId);
    }
  };

  // Add Diseases to Patient Database Function
  const addDiseasesToPatient = async () => {
    if (selectedDiseases.size === 0) {
      alert('Please select at least one disease');
      return;
    }

    // Get selected disease objects
    const selectedDiseaseData = diseases.filter(disease => 
      selectedDiseases.has(disease.id)
    );

    try {
      const response = await fetch('http://localhost:5000/api/patient/diseases', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          patientId: user.identifier, // Using login identifier (P-1001)
          patientName: user.name,     // John Patterson
          diseases: selectedDiseaseData.map(disease => ({
            diseaseId: disease.id,
            name: disease.name,
            code: disease.code,
            system: disease.system,
            sourceDatabase: disease.sourceDatabase,
            shortDefinition: disease.shortDefinition,
            dateAdded: new Date().toISOString(),
            status: 'Active'
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Success feedback
      alert(`Successfully added ${selectedDiseases.size} diseases to patient record!`);
      
      // Clear selections
      setSelectedDiseases(new Set());
      
      console.log('Diseases added successfully:', result);
      
    } catch (error) {
      console.error('Error adding diseases to patient:', error);
      alert(`Failed to add diseases: ${error.message}`);
    }
  };

  // Fetch diseases from backend
  const fetchDiseases = async () => {
    if (!diseaseQuery.trim()) {
      alert('Please enter a search term');
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams({
        term: diseaseQuery,
        total_limit: '300'
      });
      
      if (selectedDatabase !== 'all') {
        params.append('database', selectedDatabase);
      }

      const response = await fetch(`http://localhost:5000/api/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      let results;
      if (data.combinedResults) {
        results = data.combinedResults;
      } else if (data.data) {
        results = data.data;
      }

      // Transform results to consistent format
      const transformedResults = results.map((item, index) => ({
        id: item.id || index,
        name: item.term || item.Term || 'Unknown',
        system: item.system || item.System || 'N/A',
        code: item.code || item.Code || 'N/A',
        shortDefinition: item.shortdefinition || item.ShortDefinition || 'N/A',
        longDefinition: item.longdefinition || item.LongDefinition || 'N/A',
        reference: item.reference || item.Reference || 'N/A',
        ontologyBranches: item.ontologybranches || item.OntologyBranches || 'N/A',
        sourceDatabase: item.sourcedatabase || 'unknown'
      }));

      setDiseases(transformedResults);
      alert(`Found ${transformedResults.length} diseases`);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      alert(`Failed to fetch diseases: ${error.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDiseaseCheckToggle = (diseaseId) => {
    const newSelected = new Set(selectedDiseases);
    if (newSelected.has(diseaseId)) {
      newSelected.delete(diseaseId);
    } else {
      newSelected.add(diseaseId);
    }
    setSelectedDiseases(newSelected);
  };

  const openDiseaseDetail = (disease) => {
    setSelectedDiseaseDetail(disease);
    // Load existing comments and prescriptions for this disease (mock data)
    setComments([
      {
        id: 1,
        text: 'Patient shows good response to treatment',
        author: 'Dr. Smith',
        date: new Date('2024-01-10')
      },
      {
        id: 2,
        text: 'Monitor symptoms for next 7 days',
        author: 'Dr. Johnson',
        date: new Date('2024-01-12')
      }
    ]);
    setPrescriptions([
      {
        id: 1,
        text: 'Paracetamol 500mg - Take twice daily after meals',
        date: new Date('2024-01-10')
      },
      {
        id: 2,
        text: 'Rest and adequate fluid intake',
        date: new Date('2024-01-10')
      }
    ]);
  };

  const closeDiseaseDetail = () => {
    setSelectedDiseaseDetail(null);
    setComments([]);
    setPrescriptions([]);
    setNewComment('');
    setNewPrescription('');
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: user.name,
      date: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const addPrescription = () => {
    if (!newPrescription.trim()) return;
    
    const prescription = {
      id: Date.now(),
      text: newPrescription.trim(),
      date: new Date()
    };
    
    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription('');
  };

  const metrics = useMemo(() => {
    const total = reports.length;
    const resolved = reports.reduce((acc, r) => acc + r.diagnosis.filter(d => d.status === 'Resolved').length, 0);
    const active = reports.reduce((acc, r) => acc + r.diagnosis.filter(d => d.status === 'Active' || d.status === 'Under Treatment').length, 0);
    const upcoming = reports.filter(r => r.followUp).length;
    
    return { total, resolved, active, upcoming };
  }, [reports]);

  const filteredReports = reports.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    
    return (
      r.doctor.toLowerCase().includes(q) ||
      r.hospital.toLowerCase().includes(q) ||
      r.specialty.toLowerCase().includes(q) ||
      r.diagnosis.some(d => d.name.toLowerCase().includes(q))
    );
  });

  // Updated navigation items with back button
  const navItems = [
    { id: 'back', label: 'Back', icon: ArrowLeft }, // Back button in nav
    { id: 'dashboard', label: 'Dashboard', icon: Activity, active: true },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'diseases', label: 'Diseases', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Updated Diseases tab render function with back button
  const renderDiseasesTab = () => (
    <div className="space-y-6">
      

      {/* Search Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Disease Search</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={diseaseQuery}
                onChange={(e) => setDiseaseQuery(e.target.value)}
                placeholder="Search for diseases, symptoms, conditions..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && fetchDiseases()}
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="all">All Databases</option>
              <option value="ayurveda">Ayurveda</option>
              <option value="icd11">ICD-11</option>
              <option value="siddha">Siddha</option>
              <option value="unani">Unani</option>
              <option value="doctor">Doctor Added</option>
            </select>
          </div>
          
          <button
            onClick={fetchDiseases}
            disabled={searchLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {searchLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Selected Diseases Count and Add Button */}
        {selectedDiseases.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              {selectedDiseases.size} diseases selected
            </p>
            {/* Add Diseases Button */}
            <button
              onClick={addDiseasesToPatient}
              disabled={selectedDiseases.size === 0}
              className="mt-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Selected Diseases to Patient Record
            </button>
          </div>
        )}

        {/* Generate Report Button */}
        <div className="mt-4">
          <button 
            className="gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25" 
            onClick={() => window.location.href = "patientdoctor"}
          >
            Add to PatientData
          </button>
        </div>
      </div>

      {/* Results Section */}
      {diseases.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Search Results ({diseases.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-200/60">
            {diseases.map((disease) => (
              <div key={disease.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedDiseases.has(disease.id)}
                      onChange={() => handleDiseaseCheckToggle(disease.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <button
                          onClick={() => openDiseaseDetail(disease)}
                          className="text-left hover:text-blue-600 transition-colors"
                        >
                          <h4 className="text-lg font-semibold text-slate-900 mb-2">
                            {disease.name}
                          </h4>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              disease.sourceDatabase === 'ayurveda' ? 'bg-green-100 text-green-700' :
                              disease.sourceDatabase === 'icd11' ? 'bg-orange-100 text-orange-700' :
                              disease.sourceDatabase === 'siddha' ? 'bg-purple-100 text-purple-700' :
                              disease.sourceDatabase === 'unani' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {disease.sourceDatabase}
                            </span>
                          </div>
                          <div>System: {disease.system}</div>
                          <div>Code: {disease.code}</div>
                        </div>
                        
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {disease.shortDefinition}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => openDiseaseDetail(disease)}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDiseaseDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{selectedDiseaseDetail.name}</h2>
              <button
                onClick={closeDiseaseDetail}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Disease Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>System:</strong> {selectedDiseaseDetail.system}</div>
                      <div><strong>Code:</strong> {selectedDiseaseDetail.code}</div>
                      <div><strong>Database:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedDiseaseDetail.sourceDatabase === 'ayurveda' ? 'bg-green-100 text-green-700' :
                          selectedDiseaseDetail.sourceDatabase === 'icd11' ? 'bg-orange-100 text-orange-700' :
                          selectedDiseaseDetail.sourceDatabase === 'siddha' ? 'bg-purple-100 text-purple-700' :
                          selectedDiseaseDetail.sourceDatabase === 'unani' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedDiseaseDetail.sourceDatabase}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Short Definition</h3>
                    <p className="text-sm text-slate-600">{selectedDiseaseDetail.shortDefinition}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Reference</h3>
                    <p className="text-sm text-slate-600">{selectedDiseaseDetail.reference}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Ontology Branches</h3>
                    <p className="text-sm text-slate-600">{selectedDiseaseDetail.ontologyBranches}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Detailed Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedDiseaseDetail.longDefinition}</p>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Doctor Comments ({comments.length})
                </h3>
                
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{comment.author}</span>
                        <span className="text-xs text-slate-500">
                          {comment.date.toLocaleDateString()} {comment.date.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.text}</p>
                    </div>
                  ))}
                  
                  <div className="flex gap-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment..."
                      className="flex-1 p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                    <button
                      onClick={addComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Prescriptions Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Prescriptions ({prescriptions.length})
                </h3>
                
                <div className="space-y-4">
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Prescription #{prescription.id}</span>
                        <span className="text-xs text-blue-600">
                          {prescription.date.toLocaleDateString()} {prescription.date.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{prescription.text}</p>
                    </div>
                  ))}
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newPrescription}
                      onChange={(e) => setNewPrescription(e.target.value)}
                      placeholder="Add prescription (e.g., Medicine name, dosage, instructions)..."
                      className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={addPrescription}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Prescription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Your Health Records</h3>
          <p className="text-slate-500">Please wait while we secure your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col shadow-lg">
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">HealthFlow</h3>
                <p className="text-xs text-slate-500">Patient Portal</p>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation with Back Option */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  item.id === 'back'
                    ? 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-lg shadow-gray-600/25 hover:from-gray-700 hover:to-slate-700'
                    : activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200/60">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">{user.name}</div>
                <div className="text-xs text-slate-500">ID: {user.identifier}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {activeTab === 'dashboard' && 'Medical Records'}
                  {activeTab === 'diseases' && 'Disease Search & Management'}
                  {activeTab === 'prescriptions' && 'Prescriptions'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className="text-slate-500 mt-1">
                  {activeTab === 'dashboard' && 'Comprehensive health data management • FHIR R4 Compatible'}
                  {activeTab === 'diseases' && 'Search and analyze medical conditions across databases'}
                  {activeTab === 'prescriptions' && 'Manage your prescriptions and medications'}
                  {activeTab === 'settings' && 'Configure your account settings'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200">
                  <Bell className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'dashboard' && (
              <>
                {/* Enhanced Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Total Reports</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.total}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Resolved</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{metrics.resolved}</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Active Treatments</p>
                        <p className="text-3xl font-bold text-amber-600 mt-2">{metrics.active}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">Follow-ups</p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.upcoming}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-8">
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search doctors, diseases, organisation..."
                      className="w-[175] pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  
                  {/* Generate Report Button */}
                  <div>
                    <button className="gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/25"
                                onClick={() => window.location.href = "repo"}
>
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Enhanced Reports Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Medical Reports</h2>
                    <div className="text-sm text-slate-500">
                      {filteredReports.length} of {reports.length} records
                    </div>
                  </div>

                  {filteredReports.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm border border-dashed border-slate-300 rounded-2xl p-12 text-center">
                      <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No records found</h3>
                      <p className="text-slate-500">Try adjusting your search criteria</p>
                    </div>
                  ) : (
                    filteredReports.map(report => (
                      <article key={report.id} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <header className="p-6 border-b border-slate-100/60">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-xl font-semibold text-slate-900">{report.reportType}</h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  report.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  report.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {report.priority} priority
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">{report.doctor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">{report.hospital}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">
                                    {new Date(report.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700">
                                {report.specialty}
                              </div>
                              {report.followUp && (
                                <div className="px-4 py-2 bg-emerald-100 rounded-lg text-sm font-medium text-emerald-700">
                                  Follow-up: {new Date(report.followUp).toLocaleDateString('en-IN')}
                                </div>
                              )}
                              <button
                                onClick={() => setActiveReportId(activeReportId === report.id ? null : report.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              >
                                {activeReportId === report.id ? (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </header>

                        {activeReportId === report.id && (
                          <div className="p-6 bg-slate-50/30">
                            {/* Diagnosis Cards */}
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-slate-900 mb-4">Diagnosis</h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {report.diagnosis.map(diag => (
                                  <div key={diag.id} className="bg-white border border-slate-200 rounded-xl p-5">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-slate-900 mb-1">{diag.name}</h5>
                                        <div className="text-xs text-slate-500 space-x-2">
                                          <span>{diag.namasteCode}</span>
                                          <span>•</span>
                                          <span>{diag.icd11Code}</span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          diag.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                          diag.status === 'Active' ? 'bg-red-100 text-red-700' :
                                          'bg-amber-100 text-amber-700'
                                        }`}>
                                          {diag.status}
                                        </div>
                                        <div className="text-xs text-slate-500">{diag.severity} severity</div>
                                      </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 mb-4">{diag.description}</p>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <div className="text-xs font-medium text-slate-700 mb-2">Symptoms</div>
                                        <div className="flex flex-wrap gap-2">
                                          {diag.symptoms.map((symptom, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                                              {symptom}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-xs font-medium text-slate-700 mb-2">Treatments</div>
                                        <div className="text-sm text-slate-600">{diag.treatments.join(', ')}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Prescriptions & Notes */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                              <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h5 className="font-semibold text-slate-900 mb-3">Prescriptions</h5>
                                <div className="space-y-2">
                                  {report.prescriptions.map((prescription, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-sm text-slate-700">{prescription}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="bg-white border border-slate-200 rounded-xl p-5">
                                <h5 className="font-semibold text-slate-900 mb-3">Doctor's Notes</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {report.notes || 'No additional notes provided.'}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-600/25">
                                <Download className="w-4 h-4" />
                                Download PDF
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                                <Share2 className="w-4 h-4" />
                                Share Report
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Diseases Tab Content */}
            {activeTab === 'diseases' && renderDiseasesTab()}

            {/* Other Tabs Content */}
            {activeTab === 'prescriptions' && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Prescriptions</h3>
                <p className="text-slate-500">Prescription management functionality coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Settings</h3>
                <p className="text-slate-500">Account settings and preferences will be available here</p>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>• End-to-end encrypted</span>
                <span>•</span>
                <span>• FHIR R4 compatible</span>
                <span>•</span>
                <span>• HIPAA compliant</span>
              </div>
              <div>
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
