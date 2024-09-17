# main_app.py

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv
from datetime import datetime
import mysql.connector
from mysql.connector import Error
import base64
import logging

# Import the genetic algorithm function
from genetic_algorithm import genetic_algorithm_fuel_prediction

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Be cautious with this in production

# Configure logging
logging.basicConfig(level=logging.DEBUG)

model = YOLO(r"D:\samsung-solve-for-tomorrow-rev\app\runs\segment\train\weights\best.pt")

waste = [
    'alumunium', 'battery', 'cardboard', 'food_waste',
    'glass', 'paper', 'plastic', 'styrofoam', 'tea-bags'
]
model.model.names = waste
frame_width, frame_height = 1280, 720
box_annotator = sv.BoxAnnotator(thickness=2, text_thickness=2, text_scale=1)
latest_detection = None
is_streaming = False
cap = None

# Database connection function
def create_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='waste_detection',
            user='root',
            password=''
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection

def insert_waste_data(name, description, category, timestamp):
    connection = create_db_connection()
    cursor = connection.cursor()
    try:
        check_query = "SELECT count FROM waste_data WHERE name = %s"
        cursor.execute(check_query, (name,))
        record = cursor.fetchone()

        if record:
            current_count = record[0]
            new_count = current_count + 1
            update_query = "UPDATE waste_data SET count = %s, description = %s, category = %s, timestamp = %s WHERE name = %s"
            cursor.execute(update_query, (new_count, description, category, timestamp, name))
        else:
            insert_query = """INSERT INTO waste_data (name, description, category, timestamp, count) 
                              VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(insert_query, (name, description, category, timestamp, 1))

        connection.commit()
        print("Record inserted/updated successfully in waste_data table")
    except Error as err:
        print(f"Error: '{err}'")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def generate_frames():
    global latest_detection, cap
    while is_streaming:
        ret, frame = cap.read()
        if not ret:
            break

        result = model(frame, agnostic_nms=True)[0]
        detections = sv.Detections.from_yolov8(result)
        
        if len(detections) > 0:
            best_detection_index = np.argmax(detections.confidence)
            class_id = detections.class_id[best_detection_index]
            confidence = detections.confidence[best_detection_index]
            
            label = waste[class_id]
            description = f"{label} detected with {confidence:.2f} confidence"
            category = "usable" if label == "plastic" else "not usable"
            timestamp = datetime.now().isoformat()
            
            latest_detection = {
                "name": label,
                "description": description,
                "category": category,
                "timestamp": timestamp
            }
            
            insert_waste_data(label, description, category, timestamp)

        labels = [
            f"{waste[class_id]} {confidence:0.2f}"
            for _, confidence, class_id, _ in detections
        ]
        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    global is_streaming, cap
    if not is_streaming:
        cap = cv2.VideoCapture(1)  # Open camera
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)
        is_streaming = True
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop_feed')
def stop_feed():
    global is_streaming, cap
    if is_streaming:
        is_streaming = False
        if cap is not None:
            cap.release()
            cap = None
        return jsonify({"message": "Video feed stopped and camera released."})
    else:
        return jsonify({"message": "No video feed to stop."}), 404

@app.route('/latest_detection', methods=['GET'])
def get_latest_detection():
    global latest_detection
    if latest_detection:
        return jsonify(latest_detection)
    else:
        return jsonify({"message": "No detection available"}), 404

@app.route('/waste_data', methods=['GET'])
def get_waste_data():
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
            SELECT name, SUM(count) as total_count
            FROM waste_data
            GROUP BY name
            ORDER BY total_count DESC
        """
        cursor.execute(query)
        waste_data = cursor.fetchall()
        return jsonify(waste_data)
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/average_waste_data', methods=['GET'])
def get_average_waste_data():
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        query = """
            SELECT name, AVG(count) as average_count
            FROM waste_data
            GROUP BY name
            ORDER BY average_count DESC
        """
        cursor.execute(query)
        average_waste_data = cursor.fetchall()
        for record in average_waste_data:
            record['average_count'] = float(record['average_count'])
        return jsonify(average_waste_data)
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/predict_fuel', methods=['POST'])
def predict_fuel_route():
    try:
        waste_composition = request.json.get('waste_composition', [])
        if len(waste_composition) != len(waste):
            return jsonify({"error": "Invalid waste composition length"}), 400
        
        best_composition, predicted_fuel = genetic_algorithm_fuel_prediction(waste)
        
        response = {
            "optimized_composition": dict(zip(waste, best_composition)),
            "predicted_fuel": float(predicted_fuel)
        }
        return jsonify(response)
    except Exception as e:
        app.logger.error(f"An error occurred in predict_fuel: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/classify_and_predict', methods=['POST'])
def classify_and_predict():
    try:
        # Check if the post request has the file part
        if 'image' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        file = request.files['image']
        
        # If user does not select file, browser also submit an empty part without filename
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file:
            # Read the image file
            filestr = file.read()
            
            # Convert string data to numpy array
            npimg = np.frombuffer(filestr, np.uint8)
            
            # Convert numpy array to image
            image = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)
            
            # Run YOLOv8 detection
            results = model(image)
            
            # Process YOLOv8 results
            detections = []
            plastic_count = 0
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0]
                    class_id = int(box.cls)
                    conf = float(box.conf)
                    class_name = waste[class_id]
                    detections.append({
                        'class': class_name,
                        'confidence': conf,
                        'bbox': [float(x1), float(y1), float(x2), float(y2)]
                    })
                    if class_name == 'plastic':
                        plastic_count += 1
            
            waste_composition = [1 if d['class'] == 'plastic' else 0 for d in detections]
            
            best_composition, predicted_fuel = genetic_algorithm_fuel_prediction(waste_composition)
            
            response = {
                'detections': detections,
                'plastic_count': plastic_count,
                'optimized_composition': dict(zip(waste, best_composition)),
                'predicted_fuel': float(predicted_fuel)
            }
            
            processed_image = results[0].plot()
            _, buffer = cv2.imencode('.jpg', processed_image)
            base64_image = base64.b64encode(buffer).decode('utf-8')
            response['processed_image'] = f"data:image/jpeg;base64,{base64_image}"
            
            return jsonify(response)
    
    except Exception as e:
        app.logger.error(f"An error occurred in classify_and_predict: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)