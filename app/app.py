from flask import Flask, request, jsonify, send_from_directory, redirect
from ultralytics import YOLO
import os
from PIL import Image
import io
import mysql.connector

app = Flask(__name__)

# Define directories
UPLOAD_FOLDER = 'D:/samsung-solve-for-tomorrow/app/uploads'
RESULT_FOLDER = 'D:/samsung-solve-for-tomorrow/app/results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# Load YOLO model
model = YOLO("yolov8n.pt")  # Use your own model path

# Database connection
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'waste_detection'
}

def get_category_description(category_name):
    description = "No description available"
    try:
        conn = mysql.connector.connect(**db_config)
        with conn.cursor(dictionary=True) as cursor:
            sql = "SELECT description FROM waste_data WHERE category = %s"
            cursor.execute(sql, (category_name,))
            result = cursor.fetchone()  # Fetch only the first row
            if result:
                description = result['description']
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        conn.close()

    return description

def insert_waste_data(name, description, category, image_url):
    try:
        conn = mysql.connector.connect(**db_config)
        with conn.cursor() as cursor:
            sql = "INSERT INTO waste_data (name, description, category, image_url) VALUES (%s, %s, %s, %s)"
            values = (name, description, category, image_url)
            cursor.execute(sql, values)
            conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        conn.close()

@app.route('/')
def home():
    # Redirect to the waste-upload page on localhost:3000
    return redirect("http://localhost:3000/waste-upload", code=302)

@app.route('/upload_image', methods=['POST'])  # Corrected to POST method
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    image_file = request.files['image']
    if image_file:
        try:
            # Save the uploaded image
            uploaded_image_path = os.path.join(UPLOAD_FOLDER, "uploaded_image.jpg")
            image = Image.open(io.BytesIO(image_file.read()))
            image.save(uploaded_image_path)

            # Run inference
            results = model(uploaded_image_path)

            # Process results
            detected_objects = []
            for i, result in enumerate(results):
                result_image_path = os.path.join(RESULT_FOLDER, f"result_{i}.jpg")
                result.save(filename=result_image_path)
                for j, box in enumerate(result.boxes.xyxy):
                    # Determine category and name from result
                    category = result.names[int(result.boxes.cls[j])]  # Use class index from result
                    description = get_category_description(category)

                    detected_objects.append({
                        "id": j,
                        "name": category,  # Use category name
                        "description": description,
                        "image_url": f"/results/result_{i}.jpg"  # Unique URL to access each result image
                    })

                    # Insert data into database
                    insert_waste_data(
                        name=category,  # Use category name
                        description=description,
                        category=category,
                        image_url=f"/results/result_{i}.jpg"
                    )

            return jsonify({"detected_objects": detected_objects})

        except Exception as e:
            print(f"Error processing image: {e}")
            return jsonify({"error": "Failed to process image"}), 500

    return jsonify({"error": "Invalid image file"}), 400

@app.route('/waste_details/<int:waste_id>', methods=['GET'])
def waste_details(waste_id):
    try:
        conn = mysql.connector.connect(**db_config)
        with conn.cursor(dictionary=True) as cursor:
            sql = "SELECT * FROM waste_data WHERE id = %s"
            cursor.execute(sql, (waste_id,))
            result = cursor.fetchone()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database error"}), 500
    finally:
        conn.close()

    if result:
        return jsonify(result)
    else:
        return jsonify({"description": "No details", "category": "Unknown"}), 404

@app.route('/results/<path:filename>')
def serve_result_image(filename):
    return send_from_directory(RESULT_FOLDER, filename)

@app.route('/get_waste_data', methods=['GET'])
def get_waste_data():
    try:
        conn = mysql.connector.connect(**db_config)
        with conn.cursor(dictionary=True) as cursor:
            sql = "SELECT * FROM waste_data"
            cursor.execute(sql)
            result = cursor.fetchall()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Database error"}), 500
    finally:
        conn.close()

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
