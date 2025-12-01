const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'health_tracker'
};

// Create database tables on startup
async function createTables() {
  const connection = await mysql.createConnection(dbConfig);
  
  // Create patients table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS patients (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create patient_diseases table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS patient_diseases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id VARCHAR(50),
      disease_id VARCHAR(100),
      disease_name VARCHAR(255),
      disease_code VARCHAR(100),
      system_name VARCHAR(100),
      source_database VARCHAR(50),
      short_definition TEXT,
      status VARCHAR(50) DEFAULT 'Active',
      date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    )
  `);

  await connection.end();
}

// API endpoint to add diseases to patient
app.post('/api/patient/diseases', async (req, res) => {
  const { patientId, patientName, diseases } = req.body;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Insert or update patient
    await connection.execute(
      'INSERT INTO patients (id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?',
      [patientId, patientName, patientName]
    );
    
    // Insert diseases
    for (const disease of diseases) {
      await connection.execute(`
        INSERT INTO patient_diseases 
        (patient_id, disease_id, disease_name, disease_code, system_name, source_database, short_definition, status, date_added)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        patientId,
        disease.diseaseId,
        disease.name,
        disease.code,
        disease.system,
        disease.sourceDatabase,
        disease.shortDefinition,
        disease.status,
        disease.dateAdded
      ]);
    }
    
    await connection.end();
    
    res.json({ 
      success: true, 
      message: `Added ${diseases.length} diseases to patient ${patientId}`,
      patientId: patientId
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get patient diseases
app.get('/api/patient/:patientId/diseases', async (req, res) => {
  const { patientId } = req.params;
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM patient_diseases WHERE patient_id = ? ORDER BY date_added DESC',
      [patientId]
    );
    await connection.end();
    
    res.json({ success: true, diseases: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize database and start server
createTables().then(() => {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
    console.log('Database tables created successfully');
  });
}).catch(console.error);
