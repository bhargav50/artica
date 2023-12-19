import csv
import sys
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import random
import os

# Load environment variables from a .env file
load_dotenv()

# PostgreSQL database connection parameters
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = os.getenv("POSTGRES_DB", "uber")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")

# CSV file path
CSV_FILE_PATH = sys.argv[1]

def create_table(cursor):
    # Define the table schema
    create_table_query = """
    CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP,
        lat FLOAT,
        lon FLOAT,
        base VARCHAR(255),
        vehicleType VARCHAR(255)
    );
    """

    # Execute the CREATE TABLE query
    cursor.execute(create_table_query)

def load_data(cursor):
    vehicle_types = ['Standard', 'Premium', 'Express']
    # Load data from CSV file
    with open(CSV_FILE_PATH, 'r') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header row

        # Define the SQL query for data insertion
        insert_query = sql.SQL("""
            INSERT INTO rides (date, lat, lon, base, vehicleType)
            VALUES (%s, %s, %s, %s, %s)
        """)

        # Iterate through the CSV rows and insert data into the PostgreSQL database
        for row in reader:
            vehicle_type = random.choice(vehicle_types)
            row.append(vehicle_type)
            cursor.execute(insert_query, row)
            print(f'created: {row}')

def main():
    # Establish a connection to the PostgreSQL database
    connection = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

    # Create a cursor object
    cursor = connection.cursor()

    try:
        # Create the table if it does not exist
        create_table(cursor)
        print('table created ;)')

        # Load data into the table
        load_data(cursor)

        # Commit the changes to the database
        connection.commit()
        print("Data loaded successfully.")
    except Exception as e:
        # Rollback the transaction in case of an error
        connection.rollback()
        print(f"Error: {e}")
    finally:
        # Close the cursor and connection
        cursor.close()
        connection.close()

if __name__ == "__main__":
    main()
