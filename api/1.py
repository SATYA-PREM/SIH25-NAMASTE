from api_server import UnifiedMedicalClient

# Create client
client = UnifiedMedicalClient()

# Search across all databases
results = client.search_all('diabetes', total_limit=10)
print(f"Found {results['total_count']} results across all databases")

# Get results by database
for db_name, db_results in results['databases'].items():
    print(f"{db_name}: {db_results['count']} results")

# Access combined results sorted by relevance
for result in results['combined_results']:
    print(f"Term: {result['term']} (Source: {result['source_database']})")
