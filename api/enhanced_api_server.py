from flask import Flask, jsonify, request
import sqlite3
import argparse
import json
from concurrent.futures import ThreadPoolExecutor
import os
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # allow all origins

# ---------------- Configuration ----------------

# Existing databases (read-only for searches)
DATABASES = {
    'ayurveda': 'Ayurveda.db',
    'icd11': 'icd11.db',
    'siddha': 'siddha.db',
    'unani': 'unani.db'
}

# New doctor database (write for new terms, read for searches)
DOCTOR_DB = 'doctor_terminology.db'

# ---------------- Utilities ----------------

def get_connection(db_name):
    """Get database connection"""
    try:
        if not os.path.exists(db_name):
            return None
        conn = sqlite3.connect(db_name)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Database connection error: {e}")
        return None

def get_database_path(db_key):
    """Get database file path from database key"""
    if db_key == 'doctor':
        return DOCTOR_DB
    return DATABASES.get(db_key, None)

def init_doctor_database():
    """Create doctor_terminology table and indices if missing."""
    conn = sqlite3.connect(DOCTOR_DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS doctor_terminology (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_name TEXT NOT NULL,
            system TEXT NOT NULL,
            code TEXT,
            term TEXT NOT NULL,
            short_definition TEXT NOT NULL,
            long_definition TEXT,
            reference TEXT,
            ontology_branches TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute('CREATE INDEX IF NOT EXISTS idx_term ON doctor_terminology(term)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_system ON doctor_terminology(system)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_doctor ON doctor_terminology(doctor_name)')
    conn.commit()
    conn.close()
    print(f"✅ Doctor database initialized: {DOCTOR_DB}")

def detect_table_structure(db_name):
    """Detect the actual table name and column structure"""
    conn = get_connection(db_name)
    if not conn:
        return None, []
    
    try:
        cursor = conn.cursor()
        
        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = cursor.fetchall()
        
        if not tables:
            return None, []
        
        # Try common table names first
        possible_table_names = ['data', 'medical_data', 'terms', 'diseases', 'conditions']
        table_name = None
        
        table_list = [table[0] for table in tables]
        
        # Check for common table names
        for name in possible_table_names:
            if name in table_list:
                table_name = name
                break
        
        # If no common name found, use the first table
        if not table_name:
            table_name = table_list[0]
        
        # Get column information
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns_info = cursor.fetchall()
        columns = [col[1] for col in columns_info]
        
        return table_name, columns
        
    except sqlite3.Error as e:
        print(f"Error detecting table structure: {e}")
        return None, []
    finally:
        conn.close()

def make_serializable_value(val):
    """Ensure values are JSON-serializable."""
    if isinstance(val, (int, float, str)) or val is None:
        return val
    if isinstance(val, bytes):
        try:
            return val.decode('utf-8', errors='ignore')
        except Exception:
            return str(val)
    return str(val)

# ---------------- Searching Functions ----------------

def search_in_database(db_key, db_name, term=None, system=None, limit=None):
    """Search data in a single database with flexible table/column detection"""
    table_name, columns = detect_table_structure(db_name)
    
    if not table_name:
        return {
            "database": db_key,
            "error": f"No tables found in database: {db_name}",
            "data": [],
            "count": 0
        }
    
    conn = get_connection(db_name)
    if not conn:
        return {
            "database": db_key,
            "error": f"Could not connect to database: {db_name}",
            "data": [],
            "count": 0
        }
    
    try:
        cursor = conn.cursor()
        
        # Build flexible query based on available columns
        select_columns = []
        
        # Standard expected columns
        expected_cols = ['system', 'sr_no', 'id', 'code', 'term', 'short_definition', 
                        'long_definition', 'reference', 'ontology_branches']
        
        # Map available columns to expected ones (case insensitive)
        for expected in expected_cols:
            for actual in columns:
                if expected.lower() == actual.lower():
                    select_columns.append(actual)
                    break
        
        # If we don't find expected columns, use all available columns
        if not select_columns:
            select_columns = columns[:9]  # Limit to first 9 columns
        
        # Identify columns that might contain searchable text
        text_columns = []
        for col in columns:
            col_lower = col.lower()
            if any(keyword in col_lower for keyword in ['term', 'name', 'definition', 'description', 'title']):
                text_columns.append(col)
        
        # If no obvious text columns, search in all string columns
        if not text_columns:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 1")
            sample_row = cursor.fetchone()
            if sample_row:
                for i, col in enumerate(columns[:5]):  # Check first 5 columns
                    try:
                        if isinstance(sample_row[i], str):
                            text_columns.append(col)
                    except:
                        pass
        
        # Build the query
        query = f"SELECT {', '.join(select_columns)} FROM {table_name} WHERE 1=1"
        params = []
        
        if term and text_columns:
            search_conditions = []
            for col in text_columns:
                search_conditions.append(f"{col} LIKE ?")
                params.append(f"%{term}%")
            
            query += f" AND ({' OR '.join(search_conditions)})"
        
        # Add system filter if available and specified
        if system and 'system' in [col.lower() for col in columns]:
            system_col = next((col for col in columns if col.lower() == 'system'), None)
            if system_col:
                query += f" AND {system_col} LIKE ?"
                params.append(f"%{system}%")
        
        # Add ordering
        if 'term' in [col.lower() for col in columns]:
            term_col = next((col for col in columns if col.lower() == 'term'), None)
            if term_col:
                query += f" ORDER BY {term_col}"
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            result_row = {}
            for i, col in enumerate(select_columns):
                try:
                    result_row[col] = make_serializable_value(row[i])
                except IndexError:
                    result_row[col] = None
            result_row['source_database'] = db_key
            result_row['table_name'] = table_name
            results.append(result_row)
        
        return {
            "database": db_key,
            "table_name": table_name,
            "columns_found": columns,
            "searchable_columns": text_columns,
            "data": results,
            "count": len(results)
        }
    
    except sqlite3.Error as e:
        return {
            "database": db_key,
            "error": str(e),
            "data": [],
            "count": 0
        }
    finally:
        conn.close()

def search_doctor_database(term=None, system=None, limit=None):
    """Search in doctor terminology database"""
    conn = sqlite3.connect(DOCTOR_DB)
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()
        q = "SELECT * FROM doctor_terminology WHERE 1=1"
        p = []
        if term:
            q += " AND (term LIKE ? OR short_definition LIKE ? OR long_definition LIKE ?)"
            p.extend([f"%{term}%", f"%{term}%", f"%{term}%"])
        if system:
            q += " AND system LIKE ?"
            p.append(f"%{system}%")
        q += " ORDER BY term"
        if limit:
            q += " LIMIT ?"
            p.append(limit)
        cur.execute(q, p)
        rows = cur.fetchall()
        out = []
        for r in rows:
            d = {k: make_serializable_value(r[k]) for k in r.keys()}
            d['source_database'] = 'doctor'
            out.append(d)
        return {"database": "doctor", "table_name": "doctor_terminology", "data": out, "count": len(out)}
    except Exception as e:
        return {"database": "doctor", "error": str(e), "data": [], "count": 0}
    finally:
        conn.close()

def search_all_databases(term=None, system=None, limit_per_db=None, total_limit=None):
    """Search across all databases using threading"""
    results = {
        "search_term": term,
        "system_filter": system,
        "databases": {},
        "combined_results": [],
        "total_count": 0,
        "database_counts": {}
    }
    
    # Search legacy databases
    with ThreadPoolExecutor(max_workers=len(DATABASES)) as executor:
        future_to_db = {
            executor.submit(search_in_database, db_key, db_name, term, system, limit_per_db): db_key
            for db_key, db_name in DATABASES.items()
        }
        
        for future in future_to_db:
            db_key = future_to_db[future]
            try:
                db_result = future.result()
                results["databases"][db_key] = db_result
                results["combined_results"].extend(db_result["data"])
                results["database_counts"][db_key] = db_result["count"]
                results["total_count"] += db_result["count"]
            except Exception as e:
                results["databases"][db_key] = {
                    "database": db_key,
                    "error": str(e),
                    "data": [],
                    "count": 0
                }
    
    # Search doctor database
    doctor_result = search_doctor_database(term, system, limit_per_db)
    results["databases"]["doctor"] = doctor_result
    results["combined_results"].extend(doctor_result["data"])
    results["database_counts"]["doctor"] = doctor_result["count"]
    results["total_count"] += doctor_result["count"]
    
    # Sort results if we have term matches
    if term and results["combined_results"]:
        def sort_key(item):
            term_value = ""
            for key in item.keys():
                if 'term' in key.lower() or 'name' in key.lower():
                    term_value = str(item[key]).lower()
                    break
            
            term_lower = term.lower()
            
            if term_lower in term_value:
                if term_value.startswith(term_lower):
                    return (0, term_value)
                else:
                    return (1, term_value)
            return (2, term_value)
        
        results["combined_results"].sort(key=sort_key)
    
    if total_limit and total_limit > 0:
        results["combined_results"] = results["combined_results"][:total_limit]
    
    return results

# ---------------- API Routes ----------------

@app.route('/api/search', methods=['GET'])
def unified_search():
    """Unified search across all databases"""
    term = request.args.get('term', '').strip()
    system = request.args.get('system')
    limit_per_db = request.args.get('limit_per_db', type=int)
    total_limit = request.args.get('total_limit', type=int)
    database = request.args.get('database')
    
    if not term:
        return jsonify({"error": "Search term is required"}), 400
    
    if database:
        if database == 'doctor':
            return jsonify(search_doctor_database(term, system, total_limit))
        if database not in DATABASES:
            return jsonify({"error": f"Invalid database: {database}"}), 400
        
        db_name = DATABASES[database]
        result = search_in_database(database, db_name, term, system, total_limit)
        return jsonify(result)
    else:
        results = search_all_databases(term, system, limit_per_db, total_limit)
        return jsonify(results)

@app.route('/api/add-terminology', methods=['POST'])
def add_terminology():
    """Add new terminology to doctor database"""
    try:
        data = request.get_json(force=True)
        required = ['doctor_name', 'system', 'term', 'short_definition']
        missing = [f for f in required if not str(data.get(f, '')).strip()]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        conn = sqlite3.connect(DOCTOR_DB)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO doctor_terminology
            (doctor_name, system, code, term, short_definition, long_definition, reference, ontology_branches)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data['doctor_name'].strip(),
            data['system'].strip(),
            str(data.get('code', '')).strip(),
            data['term'].strip(),
            data['short_definition'].strip(),
            str(data.get('long_definition', '')).strip(),
            str(data.get('reference', '')).strip(),
            str(data.get('ontology_branches', '')).strip(),
        ))
        new_id = cur.lastrowid
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Terminology added successfully", "id": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/doctor-stats', methods=['GET'])
def doctor_stats():
    """Get statistics for doctor database"""
    try:
        conn = sqlite3.connect(DOCTOR_DB)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) AS c FROM doctor_terminology")
        total_row = cur.fetchone()
        total = int(total_row['c']) if total_row else 0
        
        cur.execute("""
            SELECT doctor_name, COUNT(*) AS c FROM doctor_terminology
            GROUP BY doctor_name ORDER BY c DESC
        """)
        by_doc = [{"doctor": r['doctor_name'], "count": int(r['c'])} for r in cur.fetchall()]
        
        cur.execute("""
            SELECT system, COUNT(*) AS c FROM doctor_terminology
            GROUP BY system ORDER BY c DESC
        """)
        by_sys = [{"system": r['system'], "count": int(r['c'])} for r in cur.fetchall()]
        
        conn.close()
        return jsonify({"total_terminology": total, "doctors": by_doc, "systems": by_sys})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/databases', methods=['GET'])
def list_databases():
    """List available databases with their status"""
    status = {}
    
    # Check legacy databases
    for k, v in DATABASES.items():
        exists = os.path.exists(v)
        t, cols = detect_table_structure(v) if exists else (None, [])
        status[k] = {
            "filename": v,
            "exists": exists,
            "table_name": t,
            "columns": cols,
            "status": "available" if exists and t else "not_found"
        }
    
    # Check doctor database
    status["doctor"] = {
        "filename": DOCTOR_DB,
        "exists": os.path.exists(DOCTOR_DB),
        "table_name": "doctor_terminology",
        "columns": ["id", "doctor_name", "system", "code", "term", "short_definition",
                    "long_definition", "reference", "ontology_branches", "created_at", "updated_at"],
        "status": "available" if os.path.exists(DOCTOR_DB) else "will_be_created"
    }
    
    return jsonify({"databases": status})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    available = len([db for db in DATABASES.values() if os.path.exists(db)])
    return jsonify({
        "status": "healthy",
        "message": "Enhanced Medical Database API is running",
        "available_databases": available,
        "total_databases": len(DATABASES),
        "doctor_database": "available" if os.path.exists(DOCTOR_DB) else "ready_to_create"
    })

@app.route('/api/debug/<db_key>', methods=['GET'])
def debug_database(db_key):
    """Debug endpoint to check database structure"""
    if db_key == 'doctor':
        return jsonify({
            "database": "doctor",
            "file_path": DOCTOR_DB,
            "table_name": "doctor_terminology",
            "columns": ["id", "doctor_name", "system", "code", "term", "short_definition",
                       "long_definition", "reference", "ontology_branches", "created_at", "updated_at"],
            "status": "available" if os.path.exists(DOCTOR_DB) else "will_be_created"
        })
    
    if db_key not in DATABASES:
        return jsonify({"error": "Invalid database key"}), 400
    
    db_name = DATABASES[db_key]
    table_name, columns = detect_table_structure(db_name)
    
    # Get sample data
    sample_data = []
    if table_name:
        conn = get_connection(db_name)
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                rows = cursor.fetchall()
                for row in rows:
                    sample_data.append(dict(row))
            except sqlite3.Error as e:
                sample_data = [{"error": str(e)}]
            finally:
                conn.close()
    
    return jsonify({
        "database": db_key,
        "file_path": db_name,
        "table_name": table_name,
        "columns": columns,
        "sample_data": sample_data
    })

# ---------------- FHIR ValueSet and ConceptMap Endpoints ----------------

@app.route('/fhir/ValueSet/$expand', methods=['GET'])
def valueset_expand():
    """FHIR ValueSet $expand operation"""
    try:
        identifier = request.args.get('identifier', 'all-traditional')
        
        # Map to your existing databases
        database_mapping = {
            'ayurveda-terms': 'ayurveda',
            'siddha-terms': 'siddha', 
            'unani-terms': 'unani',
            'icd11-terms': 'icd11',
            'all-traditional': ['ayurveda', 'siddha', 'unani']
        }
        
        databases = database_mapping.get(identifier, ['ayurveda'])
        if isinstance(databases, str):
            databases = [databases]
        
        # Get all concepts from specified databases
        all_concepts = []
        for db_key in databases:
            try:
                db_path = get_database_path(db_key)
                if not db_path or not os.path.exists(db_path):
                    continue
                    
                table_name, columns = detect_table_structure(db_path)
                if not table_name:
                    continue
                    
                conn = get_connection(db_path)
                if not conn:
                    continue
                    
                cursor = conn.cursor()
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 100")
                rows = cursor.fetchall()
                
                for row in rows:
                    row_dict = dict(row)
                    concept = {
                        "code": row_dict.get('code') or row_dict.get('id') or str(row_dict.get('sr_no', '')),
                        "display": row_dict.get('term') or row_dict.get('Term', ''),
                        "system": f"http://localhost:5000/fhir/CodeSystem/{db_key}"
                    }
                    if concept["code"] and concept["display"]:
                        all_concepts.append(concept)
                
                conn.close()
            except Exception as e:
                print(f"Error processing database {db_key}: {e}")
                continue
        
        # Return FHIR ValueSet with expansion
        valueset = {
            "resourceType": "ValueSet",
            "id": identifier,
            "url": f"http://localhost:5000/fhir/ValueSet/{identifier}",
            "version": "1.0",
            "name": identifier.replace('-', '_'),
            "title": f"Medical Terminology - {identifier.replace('-', ' ').title()}",
            "status": "active",
            "expansion": {
                "identifier": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "total": len(all_concepts),
                "contains": all_concepts
            }
        }
        
        return jsonify(valueset)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fhir/ValueSet/$validate-code', methods=['POST'])
def valueset_validate_code():
    """FHIR ValueSet $validate-code operation"""
    try:
        data = request.get_json()
        parameters = data.get('parameter', [])
        
        # Extract parameters
        code = None
        valueSet = None
        
        for param in parameters:
            if param.get('name') == 'code':
                code = param.get('valueCode')
            elif param.get('name') == 'url':
                valueSet = param.get('valueUri')
        
        if not code:
            return jsonify({"error": "Code parameter is required"}), 400
        
        # Search for code in databases
        found = False
        display = None
        
        # Search across all databases
        for db_key, db_file in DATABASES.items():
            try:
                if not os.path.exists(db_file):
                    continue
                    
                table_name, columns = detect_table_structure(db_file)
                if not table_name:
                    continue
                    
                conn = get_connection(db_file)
                if not conn:
                    continue
                    
                cursor = conn.cursor()
                
                # Search for the code in various code columns
                for col in ['code', 'id', 'Code', 'ID', 'sr_no']:
                    if col in columns:
                        cursor.execute(f"SELECT * FROM {table_name} WHERE {col} = ?", (code,))
                        row = cursor.fetchone()
                        if row:
                            row_dict = dict(row)
                            found = True
                            display = row_dict.get('term') or row_dict.get('Term', code)
                            break
                
                conn.close()
                
                if found:
                    break
                    
            except Exception as e:
                continue
        
        # Also search doctor database
        if not found:
            try:
                conn = sqlite3.connect(DOCTOR_DB)
                conn.row_factory = sqlite3.Row
                cur = conn.cursor()
                cur.execute("SELECT * FROM doctor_terminology WHERE code = ? OR id = ?", (code, code))
                row = cur.fetchone()
                if row:
                    found = True
                    display = row['term']
                conn.close()
            except:
                pass
        
        # Return FHIR Parameters resource
        result = {
            "resourceType": "Parameters",
            "parameter": [
                {
                    "name": "result",
                    "valueBoolean": found
                }
            ]
        }
        
        if display:
            result["parameter"].append({
                "name": "display",
                "valueString": display
            })
        
        result["parameter"].append({
            "name": "message", 
            "valueString": f"Code {code} is {'valid' if found else 'not found in the ValueSet'}"
        })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fhir/ConceptMap/$translate', methods=['POST'])
def conceptmap_translate():
    """FHIR ConceptMap $translate operation"""
    try:
        data = request.get_json()
        parameters = data.get('parameter', [])
        
        # Extract parameters
        code = None
        source_system = None
        target_system = None
        
        for param in parameters:
            if param.get('name') == 'code':
                code = param.get('valueCode')
            elif param.get('name') == 'system':
                system_uri = param.get('valueUri', '')
                source_system = system_uri.split('/')[-1] if '/' in system_uri else system_uri
            elif param.get('name') == 'targetsystem':
                target_uri = param.get('valueUri', '')
                target_system = target_uri.split('/')[-1] if '/' in target_uri else target_uri
        
        if not code or not source_system:
            return jsonify({"error": "Code and system parameters are required"}), 400
        
        matches = []
        
        # Simple concept mapping logic
        if source_system in ['ayurveda', 'siddha', 'unani'] and target_system == 'icd11':
            try:
                # Search source system for the code
                source_db_path = get_database_path(source_system)
                if not source_db_path or not os.path.exists(source_db_path):
                    raise Exception(f"Source database {source_system} not found")
                
                source_table, source_columns = detect_table_structure(source_db_path)
                if not source_table:
                    raise Exception(f"No table found in source database {source_system}")
                
                source_conn = get_connection(source_db_path)
                if not source_conn:
                    raise Exception(f"Cannot connect to source database {source_system}")
                
                source_cursor = source_conn.cursor()
                
                # Find the source concept
                source_concept = None
                for col in ['code', 'id', 'Code', 'ID', 'sr_no']:
                    if col in source_columns:
                        source_cursor.execute(f"SELECT * FROM {source_table} WHERE {col} = ?", (code,))
                        row = source_cursor.fetchone()
                        if row:
                            source_concept = dict(row)
                            break
                
                if source_concept:
                    source_term = source_concept.get('term') or source_concept.get('Term', '')
                    
                    # Search ICD-11 for similar terms
                    if target_system == 'icd11':
                        target_db_path = get_database_path('icd11')
                        if target_db_path and os.path.exists(target_db_path):
                            target_table, target_columns = detect_table_structure(target_db_path)
                            if target_table:
                                target_conn = get_connection(target_db_path)
                                if target_conn:
                                    target_cursor = target_conn.cursor()
                                    
                                    # Simple text matching
                                    search_terms = source_term.lower().split()
                                    for search_term in search_terms:
                                        if len(search_term) > 3:  # Only search meaningful terms
                                            for term_col in ['term', 'Term', 'title', 'Title']:
                                                if term_col in target_columns:
                                                    target_cursor.execute(f"SELECT * FROM {target_table} WHERE {term_col} LIKE ? LIMIT 3", (f"%{search_term}%",))
                                                    target_rows = target_cursor.fetchall()
                                                    
                                                    for target_row in target_rows:
                                                        target_dict = dict(target_row)
                                                        
                                                        match = {
                                                            "name": "match",
                                                            "part": [
                                                                {
                                                                    "name": "concept",
                                                                    "valueCoding": {
                                                                        "system": f"http://localhost:5000/fhir/CodeSystem/{target_system}",
                                                                        "code": target_dict.get('code') or target_dict.get('id') or str(target_dict.get('sr_no', '')),
                                                                        "display": target_dict.get('term') or target_dict.get('Term', '')
                                                                    }
                                                                },
                                                                {
                                                                    "name": "relationship", 
                                                                    "valueCode": "related-to"
                                                                },
                                                                {
                                                                    "name": "source",
                                                                    "valueUri": f"http://localhost:5000/fhir/ConceptMap/{source_system}-to-{target_system}"
                                                                }
                                                            ]
                                                        }
                                                        matches.append(match)
                                                    
                                                    if matches:  # Break after finding matches
                                                        break
                                            
                                            if matches:  # Break after finding matches
                                                break
                                    
                                    target_conn.close()
                
                source_conn.close()
                
            except Exception as e:
                print(f"Error in concept mapping: {e}")
        
        # Return FHIR Parameters resource
        result = {
            "resourceType": "Parameters", 
            "parameter": matches if matches else [
                {
                    "name": "message",
                    "valueString": f"No mapping found for code {code} from {source_system} to {target_system}"
                }
            ]
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- Main Function ----------------

def main():
    parser = argparse.ArgumentParser(description='Enhanced Medical Database API with FHIR Support')
    parser.add_argument('--mode', choices=['server', 'search'], default='server')
    parser.add_argument('--port', type=int, default=5000)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('term', nargs='?', help='Search term')
    parser.add_argument('--db', help='Database to search')
    parser.add_argument('--system', help='Filter by system')
    parser.add_argument('--limit', type=int, help='Limit results')
    args = parser.parse_args()

    # Always initialize doctor database
    init_doctor_database()

    if args.mode == 'server':
        print(f"🚀 Starting Enhanced Medical API server on {args.host}:{args.port}")
        print(f"Available endpoints:")
        print(f"  - Search: GET /api/search?term=<term>")
        print(f"  - Add terminology: POST /api/add-terminology")
        print(f"  - Health check: GET /api/health")
        print(f"  - Database info: GET /api/databases")
        print(f"  - FHIR ValueSet $expand: GET /fhir/ValueSet/$expand")
        print(f"  - FHIR ValueSet $validate-code: POST /fhir/ValueSet/$validate-code")
        print(f"  - FHIR ConceptMap $translate: POST /fhir/ConceptMap/$translate")
        app.run(host=args.host, port=args.port, debug=True)
    else:
        if not args.term:
            print("Please provide a search term")
            return
        if args.db:
            if args.db == 'doctor':
                print(json.dumps(search_doctor_database(args.term, args.system, args.limit), indent=2))
            elif args.db in DATABASES:
                print(json.dumps(
                    search_in_database(args.db, DATABASES[args.db], args.term, args.system, args.limit),
                    indent=2
                ))
            else:
                print("Invalid database key")
        else:
            print(json.dumps(search_all_databases(args.term, args.system, args.limit, args.limit), indent=2))

if __name__ == '__main__':
    main()
