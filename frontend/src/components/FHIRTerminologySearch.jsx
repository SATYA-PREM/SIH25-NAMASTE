import React, { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import './FHIRTerminologySearch.css'

const FHIRTerminologySearch = ({ onSelect, selectedSystem = null }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedResult, setSelectedResult] = useState(null)
  const [translatedCode, setTranslatedCode] = useState(null)
  const [showMapping, setShowMapping] = useState(false)

  const API_BASE = 'http://localhost:5000/api'

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term, system) => {
      if (!term || term.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('authToken')
        const params = new URLSearchParams({
          term: term,
          limit: '10',
        })

        if (system) {
          params.append('system', system)
        }

        const response = await fetch(
          `${API_BASE}/fhir/terminology/search?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`)
        }

        const data = await response.json()
        setResults(data.results || [])
      } catch (err) {
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(searchTerm, selectedSystem)
  }, [searchTerm, selectedSystem, debouncedSearch])

  const handleResultSelect = async (result) => {
    setSelectedResult(result)
    setSearchTerm(result.name || result.term || result.display || '')
    setResults([])

    // Auto-translate to ICD-11 if NAMASTE code is selected
    if (result.system && result.system !== 'icd11') {
      await translateToICD11(result)
    }

    if (onSelect) {
      onSelect(result)
    }
  }

  const translateToICD11 = async (result) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const translateRequest = {
        code: result.code || result.Code,
        system: `http://terminology.ayush.gov.in/CodeSystem/namaste/${result.system}`,
        target: 'http://id.who.int/icd/release/11/2022-02/mms/tm2',
      }

      const response = await fetch(`${API_BASE}/fhir/ConceptMap/$translate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translateRequest),
      })

      if (response.ok) {
        const translation = await response.json()
        if (
          translation.result &&
          translation.match &&
          translation.match.length > 0
        ) {
          setTranslatedCode(translation.match[0])
          setShowMapping(true)
        }
      }
    } catch (err) {
      console.error('Translation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProblemListEntry = async () => {
    if (!selectedResult) return

    try {
      const token = localStorage.getItem('authToken')

      const problemListRequest = {
        patient_id: 'patient-123', // This should come from context
        condition_code: selectedResult.code || selectedResult.Code,
        condition_system: `http://terminology.ayush.gov.in/CodeSystem/namaste/${selectedResult.system}`,
        condition_display:
          selectedResult.name || selectedResult.term || selectedResult.display,
        clinical_status: 'active',
        verification_status: 'confirmed',
        onset_date: new Date().toISOString(),
        double_coding: translatedCode
          ? {
              system: translatedCode.concept.system,
              code: translatedCode.concept.code,
              display: translatedCode.concept.display,
            }
          : null,
      }

      const response = await fetch(`${API_BASE}/fhir/Condition`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemListRequest),
      })

      if (response.ok) {
        const condition = await response.json()
        alert('FHIR Condition created successfully with double coding!')
        console.log('Created FHIR Condition:', condition)
      } else {
        throw new Error('Failed to create FHIR Condition')
      }
    } catch (err) {
      alert(`Error creating FHIR Condition: ${err.message}`)
    }
  }

  return (
    <div className="fhir-terminology-search">
      <div className="search-header">
        <h3>🔍 FHIR Terminology Search</h3>
        <p>
          Search NAMASTE terminologies with auto-complete and ICD-11 mapping
        </p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for disease terms (e.g., fever, diabetes, pain)..."
            className="search-input"
            disabled={loading}
          />
          {loading && <div className="search-spinner">🔄</div>}
        </div>

        {selectedSystem && (
          <div className="system-filter">
            <span className="filter-label">System: </span>
            <span className="filter-value">{selectedSystem.toUpperCase()}</span>
          </div>
        )}

        {error && <div className="error-message">⚠️ {error}</div>}

        {results.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              Found {results.length} results:
            </div>
            {results.map((result, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => handleResultSelect(result)}
              >
                <div className="result-main">
                  <span className="result-name">
                    {result.name || result.term || result.display || 'Unknown'}
                  </span>
                  <span className="result-code">
                    {result.code || result.Code}
                  </span>
                </div>
                <div className="result-meta">
                  <span className="result-system">
                    {result.system?.toUpperCase()}
                  </span>
                  {result.definition && (
                    <span className="result-definition">
                      {result.definition.length > 100
                        ? `${result.definition.substring(0, 100)}...`
                        : result.definition}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResult && (
        <div className="selected-result">
          <div className="selected-header">
            <h4>📋 Selected Terminology</h4>
          </div>

          <div className="selected-details">
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">
                {selectedResult.name ||
                  selectedResult.term ||
                  selectedResult.display}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Code:</span>
              <span className="detail-value">
                {selectedResult.code || selectedResult.Code}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">System:</span>
              <span className="detail-value">
                {selectedResult.system?.toUpperCase()}
              </span>
            </div>
            {selectedResult.definition && (
              <div className="detail-row">
                <span className="detail-label">Definition:</span>
                <span className="detail-value definition">
                  {selectedResult.definition}
                </span>
              </div>
            )}
          </div>

          {showMapping && translatedCode && (
            <div className="mapping-section">
              <div className="mapping-header">
                <h5>🔗 ICD-11 TM2 Mapping</h5>
              </div>
              <div className="mapping-details">
                <div className="detail-row">
                  <span className="detail-label">ICD-11 Code:</span>
                  <span className="detail-value">
                    {translatedCode.concept.code}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ICD-11 Display:</span>
                  <span className="detail-value">
                    {translatedCode.concept.display}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Equivalence:</span>
                  <span className="detail-value mapping-equivalence">
                    {translatedCode.equivalence}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={createProblemListEntry}
              disabled={loading}
            >
              📝 Create FHIR Problem List Entry
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setSelectedResult(null)
                setTranslatedCode(null)
                setShowMapping(false)
                setSearchTerm('')
              }}
            >
              🔄 Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FHIRTerminologySearch
