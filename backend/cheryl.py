# app.py
from flask import Flask, request, jsonify
from flask import send_from_directory
from rag_model import query_rag
from flask_cors import CORS
from google.cloud import firestore
import hashlib
from pathlib import Path
import os
import uuid
import requests
import random

db = firestore.Client(
    project="hackutd2025-477622",
    database="hackutd25"
)

SERP_API_KEY = os.getenv("SERP_API_KEY")
IMAGES_DIR = "images"
CSV_PATH = "data/car_data_processed.csv"

# Ensure images directory exists
Path(IMAGES_DIR).mkdir(exist_ok=True)

def escape_slash(s):
    if s is None:
        return None
    return s.replace("/", "\\/")


app = Flask(__name__)
CORS(app)

@app.route("/images/<filename>")
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

def download_image(image_url, hack_id):
    """Download image from URL and save it with a unique filename"""
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'Sec-Fetch-Dest': 'image',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site',
        }
        
        response = requests.get(image_url, headers=headers, timeout=10, stream=True, allow_redirects=True, verify=False)
        response.raise_for_status()
        
        # Verify content type is an image
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type.lower():
            print(f"✗ Not an image for {hack_id}: {content_type}")
            return None
        
        # Generate unique filename
        file_extension = image_url.split('.')[-1].split('?')[0].lower()
        if file_extension not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
            # Try to get extension from content-type
            if 'jpeg' in content_type or 'jpg' in content_type:
                file_extension = 'jpg'
            elif 'png' in content_type:
                file_extension = 'png'
            elif 'webp' in content_type:
                file_extension = 'webp'
            else:
                file_extension = 'jpg'
        
        filename = f"{uuid.uuid4().hex}.{file_extension}"
        filepath = os.path.join(IMAGES_DIR, filename)
        
        # Save image
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✓ Successfully downloaded image for {hack_id}")
        return filename
    except Exception as e:
        # Don't print full error for common 403s
        if '403' in str(e):
            return None
        print(f"✗ Error downloading image for {hack_id}: {e}")
        return None

def fetch_and_save_image(hack_id, doc_ref):
    """Fetch image from SERP API and save it"""
    try:
        # Call SERP API for Google Image Search
        serp_url = "https://serpapi.com/search"
        params = {
            "engine": "google_images",
            "q": hack_id,
            "api_key": SERP_API_KEY,
            "num": 5  # Get 5 results to have more fallback options
        }
        
        response = requests.get(serp_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Try multiple image results in case first one fails
        if "images_results" in data and len(data["images_results"]) > 0:
            for i, result in enumerate(data["images_results"][:5]):
                # Try thumbnail first (usually more reliable), then original
                for url_key in ['thumbnail', 'original']:
                    image_url = result.get(url_key)
                    
                    if image_url:
                        # Try to download and save image
                        filename = download_image(image_url, hack_id)
                        
                        if filename:
                            # Update Firestore with img_path
                            doc_ref.update({"img_path": filename})
                            return filename
            
            print(f"  → Tried {i+1} images, none worked for {hack_id}")
        
        print(f"✗ No valid images found for {hack_id}")
        return None
    except Exception as e:
        print(f"✗ Error fetching image for {hack_id}: {e}")
        return None

@app.route('/data/cars', methods=['GET'])
def get_cars():
    try:
        page = int(request.args.get('page', 1))
        if page < 1:
            page = 1
    except ValueError:
        return {"error": "Invalid page number"}, 400
    
    # Calculate pagination
    page_size = 16
    offset = (page - 1) * page_size
    
    # Query Firestore for paginated cars
    cars_ref = db.collection("cars")
    query = cars_ref.limit(page_size).offset(offset)
    docs = query.stream()
    
    cars = []
    for doc in docs:
        car_data = doc.to_dict()
        hack_id = doc.id
        
        # Check if img_path is empty
        if not car_data.get("img_path"):
            # Fetch and save image
            img_path = fetch_and_save_image(hack_id, doc.reference)
            if img_path:
                car_data["img_path"] = img_path
        
        car_data["hack_id"] = hack_id
        cars.append(car_data)
    
    # Get total count for pagination info
    total_cars = len(list(cars_ref.stream()))
    total_pages = (total_cars + page_size - 1) // page_size
    
    return jsonify({
        "cars": cars,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_cars": total_cars,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }), 200

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Missing question"}), 400

    result = query_rag(question)
    
    # Format the response with hack_ids for hyperlinking
    cars = []
    for i, hack_id in enumerate(result["hack_ids"]):
        cars.append({
            "hack_id": hack_id,
            "description": result["descriptions"][i],
            "link": f"/data/cars?hack-id={hack_id}"
        })
    
    return jsonify({
        "answer": result["answer"],
        "relevant_cars": cars
    })

if __name__ == "__main__":
    app.run(debug=True)