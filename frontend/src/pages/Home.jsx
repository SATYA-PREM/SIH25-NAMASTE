import React, { useState, useEffect } from 'react'
import { ArrowRight, Play, Shield, Database, GitBranch, Zap, Globe, Activity, Users, Award, CheckCircle, TrendingUp, Clock, Star } from 'lucide-react'

function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsLoaded(true)

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { number: '4,500+', label: 'NAMASTE Terms', icon: Database, color: 'text-blue-600' },
    { number: '5000+', label: 'ICD-11 TM2 Codes', icon: Globe, color: 'text-green-600' },
    { number: '100%', label: 'FHIR R4 Compliant', icon: Shield, color: 'text-purple-600' },
    { number: '99.9%', label: 'System Uptime', icon: TrendingUp, color: 'text-orange-600' },
  ]

  const features = [
    {
      icon: Shield,
      title: 'FHIR R4 Compliance',
      description: 'Complete implementation of HL7 FHIR R4 standards with comprehensive NAMASTE CodeSystem integration and full ICD-11 TM2 compatibility.',
      gradient: 'from-blue-500 to-cyan-500',
      benefits: ['HL7 FHIR R4 Standard', 'Global Interoperability', 'Regulatory Compliance']
    },
    {
      icon: GitBranch,
      title: 'Dual Coding System',
      description: 'Seamless bidirectional translation between NAMASTE terminology and ICD-11 TM2 codes with intelligent auto-completion and validation.',
      gradient: 'from-emerald-500 to-teal-500',
      benefits: ['Auto-translation', 'Validation Engine', 'Smart Suggestions']
    },
    {
      icon: Database,
      title: 'Secure Integration',
      description: 'Enterprise-grade security with ABHA ID authentication, encrypted data transmission, and comprehensive audit logging.',
      gradient: 'from-purple-500 to-violet-500',
      benefits: ['ABHA Authentication', 'End-to-end Encryption', 'Audit Trails']
    },
    {
      icon: Activity,
      title: 'Real-time Analytics',
      description: 'Advanced healthcare analytics with traditional medicine insights, population health trends, and compliance monitoring.',
      gradient: 'from-orange-500 to-red-500',
      benefits: ['Clinical Insights', 'Population Health', 'Compliance Tracking']
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'Built for international healthcare interoperability with WHO standards compliance and multi-language support.',
      gradient: 'from-indigo-500 to-blue-500',
      benefits: ['WHO Compliance', 'Multi-language', 'International Ready']
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Optimized microservice architecture with sub-second response times, intelligent caching, and 99.9% availability.',
      gradient: 'from-amber-500 to-yellow-500',
      benefits: ['Sub-second Response', 'Smart Caching', '99.9% Uptime']
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-[1216px] z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>z
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AYUSH EHR</h1>
                <p className="text-xs text-gray-600 font-medium">Healthcare Platform</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#solution" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Solution</a>
              <a href="#compliance" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Compliance</a>
              <a href="https://sih-25-namaste-5y54.vercel.app/" className="text-blue-800 hover:text-gray-900 font-bold transition-colors">API</a>

            </div>

            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => (window.location.href = "/login")}>
                Sign In
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Announcement Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-blue-700 text-sm font-semibold">Smart India Hackathon 2025 • Ministry of AYUSH</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Advanced Healthcare
              </span>
              <br />
              <span className="text-gray-900">Integration Platform</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Seamlessly integrating <span className="font-bold text-amber-600">NAMASTE</span> and{' '}
              <span className="font-bold text-emerald-600">ICD-11 TM2</span> terminologies into{' '}
              <span className="font-bold text-blue-600">FHIR-compliant</span> EHR systems for India's AYUSH sector
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => (window.location.href = "/login")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Launch Platform</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>


              <button className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center space-x-3">
                <Play className="h-5 w-5" />
                <a
                  href="https://youtu.be/dKIMwVQkUvY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Demo
                </a>

              </button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold mb-4">
              <Award className="h-4 w-4 mr-2" />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for healthcare professionals who demand reliability, compliance, and seamless integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              const isActive = activeFeature === index

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 border transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer ${isActive ? 'border-blue-200 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="solution" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold mb-6">
                <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                Challenge & Solution
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Bridging Traditional Medicine with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Standards</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                    <h3 className="font-bold text-red-900 mb-2">The Challenge</h3>
                    <p className="text-red-800">Traditional medicine systems lack standardized digital representation, creating barriers to integration with modern healthcare infrastructure.</p>
                  </div>

                  <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
                    <h3 className="font-bold text-green-900 mb-2">Our Solution</h3>
                    <p className="text-green-800">FHIR R4-compliant API that seamlessly integrates NAMASTE and ICD-11 TM2 terminologies into existing EHR systems.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Implementation</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">NAMASTE Integration</p>
                      <p className="text-sm text-gray-600">Complete terminology mapping for Ayurveda, Siddha, and Unani systems</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">ICD-11 TM2 Mapping</p>
                      <p className="text-sm text-gray-600">Automated translation to WHO international standards</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">FHIR R4 Compliance</p>
                      <p className="text-sm text-gray-600">Standard-compliant CodeSystems and ConceptMaps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section id="compliance" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full font-semibold mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Standards & Compliance
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built for Healthcare Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meeting the highest standards for healthcare interoperability and regulatory compliance
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                { label: 'FHIR R4 Compliant', icon: Shield },
                { label: 'NAMASTE Ready', icon: Database },
                { label: 'ICD-11 TM2', icon: Globe },
                { label: 'ABHA Integration', icon: Users },
                { label: 'WHO Standards', icon: Award },
              ].map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <p className="font-semibold text-sm">{item.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Star className="h-5 w-5" />
                <span className="font-semibold">Enterprise-Grade Security & Performance</span>
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AYUSH EHR</h3>
                  <p className="text-gray-400 text-sm">Healthcare Platform</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing traditional medicine integration with modern healthcare systems through advanced FHIR R4 compliance and WHO standards.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Database className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integration Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">FHIR R4</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WHO Standards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <span>© 2025 AYUSH EHR Platform</span>
                <span>•</span>
                <span>Ministry of AYUSH, Government of India</span>
                <span>•</span>
                <span>Smart India Hackathon 2025</span>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home