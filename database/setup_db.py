import asyncio
import asyncpg
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

async def create_tables():
    print("Connecting to database...")
    conn = await asyncpg.connect(DATABASE_URL)
    
    print("Creating tables...")
    
    # Read and execute schema
    with open("schema.sql", "r") as f:
        schema = f.read()
    
    await conn.execute(schema)
    
    print("Tables created successfully!")
    
    # Verify tables
    tables = await conn.fetch("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    
    print("\nTables in database:")
    for table in tables:
        print(f"  - {table['table_name']}")
    
    await conn.close()
    print("\nDatabase setup complete!")

if __name__ == "__main__":
    asyncio.run(create_tables())
