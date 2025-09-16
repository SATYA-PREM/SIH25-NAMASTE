import React, { useState, useEffect } from 'react'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  MapPin,
  Lightbulb,
  ChevronDown
} from 'lucide-react'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    commonConditions: [],
    treatmentTypes: [],
    monthlyTrends: [],
    geographicDistribution: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Mock analytics data
      const mockData = {
        totalPatients: 1247,
        totalConsultations: 3892,
        avgConsultationsPerPatient: 3.1,
        recoveryRate: 87.3,
        commonConditions: [
          { name: 'Hypertension', count: 234, percentage: 18.8, trend: '+5%', trendType: 'positive' },
          { name: 'Diabetes Type 2', count: 189, percentage: 15.2, trend: '+3%', trendType: 'positive' },
          { name: 'Arthritis', count: 156, percentage: 12.5, trend: '+8%', trendType: 'positive' },
          { name: 'Migraine', count: 134, percentage: 10.7, trend: '-2%', trendType: 'negative' },
          { name: 'Anxiety Disorders', count: 98, percentage: 7.9, trend: '+12%', trendType: 'positive' },
        ],
        treatmentTypes: [
          { name: 'Ayurveda', count: 567, percentage: 45.5, color: 'bg-emerald-500' },
          { name: 'Siddha', count: 312, percentage: 25.0, color: 'bg-blue-500' },
          { name: 'Unani', count: 234, percentage: 18.8, color: 'bg-purple-500' },
          { name: 'Homeopathy', count: 134, percentage: 10.7, color: 'bg-orange-500' },
        ],
        monthlyTrends: [
          { month: 'Jan', patients: 89, consultations: 234 },
          { month: 'Feb', patients: 102, consultations: 289 },
          { month: 'Mar', patients: 156, consultations: 356 },
          { month: 'Apr', patients: 134, consultations: 398 },
          { month: 'May', patients: 178, consultations: 445 },
          { month: 'Jun', patients: 203, consultations: 512 },
        ],
        geographicDistribution: [
          { state: 'Maharashtra', patients: 234, percentage: 18.8 },
          { state: 'Tamil Nadu', patients: 189, percentage: 15.2 },
          { state: 'Karnataka', patients: 156, percentage: 12.5 },
          { state: 'Kerala', patients: 134, percentage: 10.7 },
          { state: 'Gujarat', patients: 98, percentage: 7.9 },
        ],
      }

      setTimeout(() => {
        setAnalyticsData(mockData)
        setLoading(false)
      }, 1000)
    }

    fetchAnalytics()
  }, [timeRange])

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Analytics</h3>
            <p className="text-gray-600">Generating insights from your data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Traditional Medicine Diagnosis Patterns and Insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.totalPatients?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.totalConsultations?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Consultations/Patient</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.avgConsultationsPerPatient || '0'}
                </p>
                <p className="text-sm text-blue-600 mt-1">+0.3 from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.recoveryRate}%
                </p>
                <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Common Conditions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Activity className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Most Common Conditions</h2>
            </div>
            <div className="space-y-4">
              {analyticsData.commonConditions?.map((condition, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{condition.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{condition.count} patients</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        condition.trendType === 'positive' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {condition.trend}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${condition.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{condition.percentage}% of total</span>
                  </div>
                </div>
              )) || []}
            </div>
          </div>

          {/* Treatment Types Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <PieChart className="w-5 h-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Treatment Types Distribution</h2>
            </div>
            <div className="space-y-4 mb-6">
              {analyticsData.treatmentTypes?.map((treatment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${treatment.color} rounded-full mr-3`} />
                    <span className="text-sm font-medium text-gray-900">{treatment.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{treatment.count} patients</span>
                    <span className="text-sm font-medium text-gray-900">{treatment.percentage}%</span>
                  </div>
                </div>
              )) || []}
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              {analyticsData.treatmentTypes?.map((treatment, index) => (
                <div
                  key={index}
                  className={treatment.color}
                  style={{ width: `${treatment.percentage}%` }}
                />
              )) || []}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Geographic Distribution</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {analyticsData.geographicDistribution?.map((location, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{location.state}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">{location.patients}</p>
                <p className="text-sm text-gray-600 mb-3">{location.percentage}% of total</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${location.percentage}%` }}
                  />
                </div>
              </div>
            )) || []}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {analyticsData.monthlyTrends?.map((month, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3">{month.month}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">New Patients</p>
                    <p className="text-lg font-bold text-blue-600">{month.patients}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Consultations</p>
                    <p className="text-lg font-bold text-green-600">{month.consultations}</p>
                  </div>
                </div>
              </div>
            )) || []}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Key Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Pattern Recognition</h3>
              <p className="text-sm text-gray-700">
                Hypertension shows highest prevalence in traditional medicine consultations, 
                suggesting effective AYUSH treatments for cardiovascular conditions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Growth Trend</h3>
              <p className="text-sm text-gray-700">
                Anxiety disorder treatments have increased by 12%, indicating growing 
                acceptance of traditional medicine for mental health conditions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Regional Preference</h3>
              <p className="text-sm text-gray-700">
                Maharashtra leads in AYUSH adoption, followed by Tamil Nadu and Karnataka, 
                showing strong regional cultural alignment with traditional medicine.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics