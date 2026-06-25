import sqlite3

conn = sqlite3.connect("database.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS launch_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

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
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    launch_id INTEGER,

    platform TEXT,

    regenerated_content TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS image_prompt_history(

id INTEGER PRIMARY KEY AUTOINCREMENT,
product_name TEXT,
occasion TEXT,
prompt TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)
""")

try:
    cursor.execute("""
    ALTER TABLE image_prompt_history
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    """)
    conn.commit()
except:
    pass

conn.commit()
conn.close()