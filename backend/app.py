from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta

import sqlite3
import requests
import os

import urllib3



urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")


app = Flask(__name__)
CORS(app)


DB_NAME = "database.db"
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS image_prompt_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    occasion TEXT,
    prompt TEXT
)
""")
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
    regenerated_content TEXT
)
""")

conn.commit()
conn.close()

def call_ai(prompt):

    try:

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
        )

        result = response.json()
        return result["choices"][0]["message"]["content"]

    except:

        try:

            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/llama-3.1-8b-instruct:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                }
            )

            result = response.json()
            return result["choices"][0]["message"]["content"]

        except:

            response = requests.post(
                "https://api.cerebras.ai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {CEREBRAS_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3.1-8b",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                }
            )

            result = response.json()
            return result["choices"][0]["message"]["content"]

@app.route("/")
def home():
    return jsonify({
        "message": "AI Backend Running"
    })
@app.route("/generate", methods=["POST"])
def generate():

    try:

        data = request.json

        product_name = data.get("productName", "")
        key_features = data.get("keyFeatures", "")
        occasion = data.get("occasion", "")
        price_range = data.get("priceRange", "")
        urgency_level = data.get("urgencyLevel", "")

        instagram_prompt = f"""
Generate an engaging Instagram caption.

Requirements:
- Length between 150 and 200 characters.
- Visual and attractive tone.
- Include emojis.
- Include 3 to 5 hashtags.
- Encourage users to take action.

Product Name: {product_name}
Features: {key_features}
Occasion: {occasion}
Price Range: {price_range}
Urgency: {urgency_level}

Return plain text only.
"""

        whatsapp_prompt = f"""
Generate a WhatsApp broadcast message.

Requirements:
- Conversational and personal tone.
- Length between 80 and 120 words.
- Friendly style.
- Mention product benefits.
- Include a call-to-action.
- Multiple lines are allowed.

Product Name: {product_name}
Features: {key_features}
Occasion: {occasion}
Price Range: {price_range}
Urgency: {urgency_level}

Return plain text only.
"""

        email_subject_prompt = f"""
Generate only a professional email subject line.

Product Name: {product_name}

Return plain text only.
"""

        email_body_prompt = f"""
Generate a professional email body.

Requirements:
- Start with a greeting.
- Write exactly 3 paragraphs.
- End with a closing message.
- Formal tone.
- Mention key features and benefits.
- Include a call-to-action.

Product Name: {product_name}
Features: {key_features}
Occasion: {occasion}
Price Range: {price_range}
Urgency: {urgency_level}

Return plain text only.
"""

        linkedin_prompt = f"""
Generate a professional LinkedIn post.

Requirements:
- Professional and business tone.
- 80 to 120 words.
- 2 short paragraphs.
- Highlight key features and benefits.
- Mention the target occasion.
- End with a call-to-action.
- Include 2 or 3 relevant hashtags.

Product Name: {product_name}
Features: {key_features}
Occasion: {occasion}
Price Range: {price_range}
Urgency: {urgency_level}

Return plain text only.
"""

        facebook_prompt = f"""
Generate a Facebook promotional post.

Requirements:
- Friendly and engaging tone.
- Length between 80 and 120 words.
- 2 short paragraphs.
- Create excitement around the product launch.
- Mention key features and benefits.
- Include a strong call-to-action.
- Include emojis.
- Include 3 to 5 hashtags.

Product Name: {product_name}
Features: {key_features}
Occasion: {occasion}
Price Range: {price_range}
Urgency: {urgency_level}

Return plain text only.
"""

        instagram = call_ai(instagram_prompt)

        whatsapp = call_ai(whatsapp_prompt)

        email_subject = call_ai(email_subject_prompt)

        email_body = call_ai(email_body_prompt)

        linkedin = call_ai(linkedin_prompt)

        facebook = call_ai(facebook_prompt)
        
        
        

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        created_at = (
            datetime.utcnow() + timedelta(hours=5, minutes=30)
        ).strftime("%Y-%m-%d %H:%M:%S")

        
        cursor.execute("""
        INSERT INTO launch_history
        (
        product_name,
        key_features,
        occasion,
        price_range,
        urgency_level,
        instagram,
        whatsapp,
        email_subject,
        email_body,
        linkedin,
        facebook,
        created_at
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,

        (

        product_name,
        key_features,
        occasion,
        price_range,
        urgency_level,
        instagram,
        whatsapp,
        email_subject,
        email_body,
        linkedin,
        facebook,
        created_at

        ))

        conn.commit()
        conn.close()

        return jsonify({

            "instagram": instagram,

            "whatsapp": whatsapp,

            "email_subject": email_subject,

            "email_body": email_body,

            "linkedin": linkedin,

            "facebook": facebook

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/regenerate", methods=["POST"])
def regenerate():

    try:

        data = request.json

        platform = data.get("platform", "")
        product = data.get("product", "")

        prompt = f"""
Generate only {platform} content for this product.

Product:
{product}

Rules:
- Return plain text only.
- No JSON.
- No markdown.
- Make it different from previous content.
- Write professionally.
"""

        text = call_ai(prompt)

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO regeneration_log
        (
            launch_id,
            platform,
            regenerated_content
        )
        VALUES (?, ?, ?)
        """,
        (
            1,
            platform,
            text
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "content": text
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/history", methods=["GET"])
def history():

    try:

        conn = sqlite3.connect(DB_NAME)

        cursor = conn.cursor()

        cursor.execute("""
        SELECT
        id,
        product_name,
        occasion,
        price_range,
        urgency_level,
        created_at

        FROM launch_history

        ORDER BY id DESC
        """)

        rows = cursor.fetchall()
        

        conn.close()

        history_data = []

        for row in rows:

            history_data.append({

                "id": row[0],
                "product_name": row[1],
                "occasion": row[2],
                "price_range": row[3],
                "urgency_level": row[4],
                "created_at": row[5]

            })

        return jsonify(history_data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/analytics", methods=["GET"])
def analytics():


    try:

        conn = sqlite3.connect(DB_NAME)

        cursor = conn.cursor()

        cursor.execute("""
        SELECT
        id,
        product_name,
        occasion,
        created_at
        FROM launch_history
        ORDER BY id DESC
        """)

        rows = cursor.fetchall()
        monthly_counts = {}

        for row in rows:

           date = row[3]

           if date:

                month = date[:7]      # 2026-06

                monthly_counts[month] = (
                   monthly_counts.get(month, 0) + 1
                )

        monthly_data = []

        for month, count in monthly_counts.items():

            monthly_data.append({
                "month": month,
                "count": count
            })

        total_campaigns = len(rows)

        products = {}
        occasions = {}

        for row in rows:

            product = row[1]
            occasion = row[2]

            products[product] = products.get(product, 0) + 1
            occasions[occasion] = occasions.get(occasion, 0) + 1

        total_products = len(products)

        latest_campaign = (
            rows[0][1]
            if rows
            else "No Data"
        )
        
        last_campaign_time = (
            rows[0][3]
            if rows
            else "No Data"
        )

        top_product = (
            max(products, key=products.get)
            if products
            else "No Data"
        )

        top_occasion = (
            max(occasions, key=occasions.get)
            if occasions
            else "No Data"
        )

        chart_data = []

        for occasion, count in occasions.items():

            chart_data.append({
                "occasion": occasion,
                "count": count
            })

        recent_campaigns = []

        for row in rows[:10]:

            recent_campaigns.append({
                "id": row[0],
                "product": row[1],
                "occasion": row[2],
                "date": row[3]
            })

        conn.close()

        return jsonify({

            "totalCampaigns": total_campaigns,

            "totalProducts": total_products,

            "latestCampaign": latest_campaign,
            
            "lastCampaignTime": last_campaign_time,

            "topProduct": top_product,

            "topOccasion": top_occasion,

            "chartData": chart_data,

            "recentCampaigns": recent_campaigns,
            
            "monthlyData" : monthly_data

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/latest-campaign", methods=["GET"])
def latest_campaign():

    try:

        conn = sqlite3.connect(DB_NAME)

        cursor = conn.cursor()

        cursor.execute("""
        SELECT

        product_name,
        occasion,

        instagram,
        whatsapp,

        email_subject,
        email_body,

        linkedin,
        facebook

        FROM launch_history

        ORDER BY id DESC

        LIMIT 1
        """)

        row = cursor.fetchone()

        conn.close()

        if not row:

            return jsonify({
                "error": "No campaign found"
            }), 404

        return jsonify({

            "product_name": row[0],
            "occasion": row[1],

            "instagram": row[2],
            "whatsapp": row[3],

            "email_subject": row[4],
            "email_body": row[5],

            "linkedin": row[6],
            "facebook": row[7]

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
        
@app.route("/history/<int:launch_id>", methods=["GET"])
def history_details(launch_id):

    try:

        conn = sqlite3.connect(DB_NAME)

        cursor = conn.cursor()

        cursor.execute("""
        SELECT
            id,
            product_name,
            occasion,
            instagram,
            whatsapp,
            email_subject,
            email_body,
            linkedin,
            facebook,
            created_at
        FROM launch_history
        WHERE id = ?
        """, (launch_id,))

        row = cursor.fetchone()

        conn.close()

        if not row:
            return jsonify({
                "error": "Campaign not found"
            }), 404

        return jsonify({

            "id": row[0],
            "product_name": row[1],
            "occasion": row[2],

            "instagram": row[3],
            "whatsapp": row[4],

            "email_subject": row[5],
            "email_body": row[6],

            "linkedin": row[7],
            "facebook": row[8],

            "created_at": row[9]

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/delete-campaign/<int:id>", methods=["DELETE"])
def delete_campaign(id):

    try:

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        # regeneration logs delete
        cursor.execute("""
        DELETE FROM regeneration_log
        WHERE launch_id=?
        """, (id,))

        # launch history delete
        cursor.execute("""
        DELETE FROM launch_history
        WHERE id=?
        """, (id,))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Campaign deleted successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
        
@app.route("/clear-history", methods=["DELETE"])
def clear_history():

    try:

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM regeneration_log")
        cursor.execute("DELETE FROM launch_history")

        conn.commit()
        conn.close()

        return jsonify({
            "message": "History cleared successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/regeneration-analytics", methods=["GET"])
def regeneration_analytics():

    try:

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("""
        SELECT platform, COUNT(*)
        FROM regeneration_log
        GROUP BY platform
        """)

        rows = cursor.fetchall()

        total_regenerations = 0
        chart_data = []

        for row in rows:

            platform = row[0]
            count = row[1]

            total_regenerations += count

            chart_data.append({
                "platform": platform,
                "count": count
            })

        most_regenerated = (
            max(chart_data, key=lambda x: x["count"])["platform"]
            if chart_data
            else "No Data"
        )

        cursor.execute("""
        SELECT
        id,
        launch_id,
        platform
        FROM regeneration_log
        ORDER BY id DESC
        LIMIT 10
        """)

        recent_rows = cursor.fetchall()

        recent_logs = []

        for row in recent_rows:

            recent_logs.append({
                "id": row[0],
                "launch_id": row[1],
                "platform": row[2]
            })

        conn.close()

        return jsonify({

            "totalRegenerations": total_regenerations,

            "mostRegenerated": most_regenerated,

            "chartData": chart_data,

            "recentLogs": recent_logs

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/generate-image-prompt", methods=["POST"])
def generate_image_prompt():

    try:

        data = request.json

        product_name = data.get("productName", "")
        occasion = data.get("occasion", "")

        prompt = f"""
Create a professional AI image prompt for:

Product: {product_name}
Occasion: {occasion}

Return only the image prompt.
"""

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta-llama/llama-3.1-8b-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            verify=False
        )

        result = response.json()

        image_prompt = result["choices"][0]["message"]["content"]

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO image_prompt_history
        (
        product_name,
        occasion,
        prompt
        )
        VALUES (?, ?, ?)
        """,
        (
        product_name,
        occasion,
        image_prompt
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "prompt": image_prompt
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/image-history", methods=["GET"])
def image_history():

    try:

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("""
        SELECT
        id,
        product_name,
        occasion,
        prompt
        FROM image_prompt_history
        ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        conn.close()

        data = []

        for row in rows:

            data.append({

                "id": row[0],
                "product_name": row[1],
                "occasion": row[2],
                "prompt": row[3]
                

            })

        return jsonify(data)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500       


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)