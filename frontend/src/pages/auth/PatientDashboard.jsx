import React from "react"
import "./PatientDashboard.css"

export default function PatientDashboard() {
  const patientName = "John Doe"

  const diagnoses = [
    {
      name: "Hypertension",
      description:
        "A condition in which the force of the blood against the artery walls is too high.",
      namasteId: "NM12345",
      icdId: "I10",
    },
    {
      name: "Diabetes Mellitus",
      description:
        "A group of diseases that result in too much sugar in the blood (high blood glucose).",
      namasteId: "NM67890",
      icdId: "E11",
    },
    {
      name: "Asthma",
      description:
        "A condition in which your airways narrow and swell, producing extra mucus.",
      namasteId: "NM54321",
      icdId: "J45",
    },
    {
      name: "Arthritis",
      description:
        "Inflammation of one or more joints, causing pain and stiffness.",
      namasteId: "NM98765",
      icdId: "M19",
    },
  ]

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome, {patientName}</h1>
          <p>
            This is your personalized health dashboard where you can view your
            diagnoses and stay updated with your medical records.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="/user-placeholder.png"
            alt="User"
            className="profile-pic"
          />
        </div>
      </section>

      {/* Diagnoses Section */}
      <section className="diagnoses">
        <h2>Your Diagnoses</h2>
        <div className="diagnosis-grid">
          {diagnoses.map((disease, idx) => (
            <div key={idx} className="diagnosis-card">
              <h3>{disease.name}</h3>
              <p className="description">{disease.description}</p>
              <div className="ids">
                <p>
                  <span className="label">Namaste ID:</span> {disease.namasteId}
                </p>
                <p>
                  <span className="label">ICD ID:</span> {disease.icdId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
