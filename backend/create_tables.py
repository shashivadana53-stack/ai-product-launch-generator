import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS launch_history (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    key_features TEXT,
    occasion TEXT,
    price_range TEXT,
    urgency_level TEXT,
    instagram TEXT,
    whatsapp TEXT,
    email_subject TEXT,
    email_body TEXT,
    linkedin TEXT,
    facebook TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS regeneration_log (
    id SERIAL PRIMARY KEY,
    launch_id INTEGER,
    platform TEXT,
    regenerated_content TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS image_prompt_history (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    occasion TEXT,
    prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("Tables created successfully!")