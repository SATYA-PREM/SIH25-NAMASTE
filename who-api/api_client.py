import requests
import json

class UnifiedMedicalClient:
    def __init__(self, base_url='http://127.0.0.1:5000'):
        self.base_url = base_url
    
    def search_all(self, term, system=None, total_limit=None, limit_per_db=None):
        """Search term across all databases"""
        params = {'term': term}
        if system:
            params['system'] = system
        if total_limit:
            params['total_limit'] = total_limit
        if limit_per_db:
            params['limit_per_db'] = limit_per_db
        
        try:
            response = requests.get(f"{self.base_url}/api/search", params=params)
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def search_database(self, database, term, system=None, limit=None):
        """Search term in specific database"""
        params = {'term': term, 'database': database}
        if system:
            params['system'] = system
        if limit:
            params['total_limit'] = limit
        
        try:
            response = requests.get(f"{self.base_url}/api/search", params=params)
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def get_statistics(self):
        """Get database statistics"""
        try:
            response = requests.get(f"{self.base_url}/api/stats")
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def list_databases(self):
        """Get list of available databases"""
        try:
            response = requests.get(f"{self.base_url}/api/databases")
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def health_check(self):
        """Check API health"""
        try:
            response = requests.get(f"{self.base_url}/api/health")
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

# Example usage and testing
if __name__ == '__main__':
    client = UnifiedMedicalClient()
    
    # Test connection
    print("=== Health Check ===")
    health = client.health_check()
    print(json.dumps(health, indent=2))
    
    # Get statistics
    print("\n=== Database Statistics ===")
    stats = client.get_statistics()
    print(json.dumps(stats, indent=2))
    
    # Search across all databases
    print("\n=== Search All Databases ===")
    search_results = client.search_all('heart', total_limit=5)
    print(f"Found {search_results.get('total_count', 0)} total results")
    
    # Print top results
    for result in search_results.get('combined_results', [])[:3]:
        print(f"- {result.get('term')} (from {result.get('source_database')})")
    
    # Search specific database
    print("\n=== Search Specific Database ===")
    ayurveda_results = client.search_database('ayurveda', 'diabetes', limit=3)
    print(json.dumps(ayurveda_results, indent=2))
