import io
import os
import fitz  # PyMuPDF
import logging
from webcolors import rgb_to_name
from quart import Quart, request, jsonify
from quart_cors import cors

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Quart(__name__)
app = cors(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_color_name(rgb):
    try:
        return rgb_to_name(tuple(int(c * 255) for c in rgb))
    except ValueError:
        return f"RGB({rgb[0]:.2f}, {rgb[1]:.2f}, {rgb[2]:.2f})"

def get_room_type_from_color(rgb):
    # Map rounded RGB values to room types
    color_map = {
        (0.30, 0.69, 0.31): "bedroom",
        (1.00, 0.93, 0.23): "bathroom/toilet",
        (0.96, 0.26, 0.21): "hall",
        (0.61, 0.16, 0.69): "kitchen"
    }
    # Round to 2 decimal places for matching
    rounded_rgb = tuple(round(c, 2) for c in rgb)
    return color_map.get(rounded_rgb)

def is_black_color(rgb):
    # Check if the color is black or very close to black
    # Using a small threshold to account for minor variations
    threshold = 0.1
    return all(c <= threshold for c in rgb)

def extract_shapes_from_pdf(pdf_path):
    shapes_data = []
    try:
        doc = fitz.open(pdf_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_height = page.rect.height

            for shape in page.get_drawings():
                bbox = shape.get("rect")
                fill_color = shape.get("fill")

                if bbox and fill_color:
                    # Skip black colored shapes
                    if is_black_color(fill_color):
                        continue
                        
                    # Try to map color to room type
                    room_type = get_room_type_from_color(fill_color)
                    if room_type:
                        color_label = room_type
                    else:
                        color_label = get_color_name(fill_color)
                    
                    # Transform Y-coordinates to start from bottom-left
                    x0, y0, x1, y1 = bbox.x0, page_height - bbox.y1, bbox.x1, page_height - bbox.y0
                    
                    # Calculate width and height
                    width = abs(x1 - x0)
                    height = abs(y1 - y0)

                    shape_info = {
                        "page": page_num + 1,
                        "color": color_label,
                        "rgb": tuple(round(c, 3) for c in fill_color),
                        "coordinates": {
                            "x0": round(x0, 2),
                            "y0": round(y0, 2),
                            "x1": round(x1, 2),
                            "y1": round(y1, 2)
                        },
                        "dimensions": {
                            "width": round(width, 2),
                            "height": round(height, 2)
                        }
                    }
                    shapes_data.append(shape_info)
        
        doc.close()
        return shapes_data
    except Exception as e:
        logger.error(f"Error extracting shapes from PDF: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
async def health_check():
    return jsonify({
        "status": "healthy",
        "message": "PDF Shape Extraction API is running"
    }), 200

@app.route('/verify-pdf', methods=['POST'])
async def verify_pdf():
    try:
        form = await request.form
        
        # Get city, pincode and scale information from form data
        city = form.get('city')
        pincode = form.get('pincode')
        scale_value = form.get('scale_value')
        scale_unit = form.get('scale_unit')
        scale_equals = form.get('scale_equals')
        scale_equals_unit = form.get('scale_equals_unit')
        
        # Validate required fields
        if not all([city, pincode, scale_value, scale_unit, scale_equals, scale_equals_unit]):
            return jsonify({
                "status": "error",
                "message": "Missing required fields: city, pincode, and scale information are required"
            }), 400

        # Validate scale values are numeric and positive
        try:
            if float(scale_value) <= 0 or float(scale_equals) <= 0:
                return jsonify({
                    "status": "error",
                    "message": "Scale values must be positive numbers"
                }), 400
        except ValueError:
            return jsonify({
                "status": "error",
                "message": "Invalid scale values"
            }), 400

        # Check if file is present in request
        if 'file' not in (await request.files):
            return jsonify({
                "status": "error",
                "message": "No file part in the request"
            }), 400

        file = (await request.files)['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400

        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": "File type not allowed. Please upload a PDF file."
            }), 400

        # Save the uploaded file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        await file.save(file_path)
        
        logger.info(f"Processing file: {file.filename}")
        logger.info(f"Location: {city}-{pincode}")
        logger.info(f"Scale: {scale_value}{scale_unit} = {scale_equals}{scale_equals_unit}")
        
        # Extract shapes from the PDF
        shapes_data = extract_shapes_from_pdf(file_path)

        # Count room types
        room_counts = {
            "bedroom": 0,
            "bathroom/toilet": 0,
            "hall": 0,
            "kitchen": 0,
            "other": 0
        }
        for shape in shapes_data:
            color = shape.get("color", "other")
            if color in room_counts:
                room_counts[color] += 1
            else:
                room_counts["other"] += 1
        
        # Clean up the temporary file
        os.remove(file_path)
        
        logger.info(f"Successfully processed {len(shapes_data)} shapes for {city}-{pincode}")
        
        return jsonify({
            "status": "success",
            "message": f"Successfully extracted {len(shapes_data)} shapes",
            "filename": file.filename,
            "city": city,
            "pincode": pincode,
            "scale": {
                "value": scale_value,
                "unit": scale_unit,
                "equals": scale_equals,
                "equals_unit": scale_equals_unit
            },
            "shapes": shapes_data,
            "room_counts": room_counts,
            "location": {
                "city": city,
                "pincode": pincode
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Error processing PDF: {str(e)}"
        }), 500

if __name__ == "__main__":
    logger.info("Starting PDF Shape Extraction API...")
    app.run(debug=True, host='127.0.0.1', port=5000)

