import io
import os
import fitz  # PyMuPDF
import logging
import math
from webcolors import rgb_to_name
from quart import Quart, request, jsonify
from quart_cors import cors
import motor.motor_asyncio
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGODB_URL = "mongodb+srv://sthawait1:8xjmVTJLOkeyBrrj@cluster0.82yby.mongodb.net/Construction_Plan_Verification?retryWrites=true&w=majority&appName=Cluster0"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.Construction_Plan_Verification
simple_building_rules = db.simplebuildingrules

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Quart(__name__)
app = cors(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# PDF point to inch conversion (1 point = 1/72 inch)
PDF_POINT_TO_INCH = 1/72

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
        # Original colors
        (0.30, 0.69, 0.31): "bedroom",
        (1.00, 0.93, 0.23): "bathroom",
        (0.96, 0.26, 0.21): "hall",
        (0.61, 0.16, 0.69): "kitchen",
        # Additional colors for more flexibility
        (0.29, 0.68, 0.30): "bedroom",      # Slight variation of green
        (0.31, 0.70, 0.32): "bedroom",      # Slight variation of green
        (0.99, 0.92, 0.22): "bathroom",     # Slight variation of yellow
        (0.95, 0.25, 0.20): "hall",         # Slight variation of red
        (0.60, 0.15, 0.68): "kitchen",      # Slight variation of purple
        (0.00, 0.50, 1.00): "balcony",      # Blue
        (1.00, 0.65, 0.00): "dining",       # Orange
        (0.50, 0.00, 0.50): "study"         # Purple
    }
    # Round to 2 decimal places for matching
    rounded_rgb = tuple(round(c, 2) for c in rgb)
    return color_map.get(rounded_rgb)

def is_black_color(rgb):
    # Check if the color is black or very close to black
    # Using a small threshold to account for minor variations
    threshold = 0.1
    return all(c <= threshold for c in rgb)

def convert_pdf_points_to_real_units(value, scale_info):
    """
    Convert PDF points to real-world units based on scale information
    1 PDF point = 1/72 inch
    """
    # First convert PDF points to inches
    inches = value * PDF_POINT_TO_INCH
    
    # Then apply the scale conversion
    if scale_info['unit'] == 'inch':
        # Direct conversion using the scale
        return inches * (float(scale_info['equals']) / float(scale_info['value']))
    elif scale_info['unit'] == 'cm':
        # Convert inches to cm first (1 inch = 2.54 cm)
        cm = inches * 2.54
        # Then apply the scale
        return cm * (float(scale_info['equals']) / float(scale_info['value']))
    elif scale_info['unit'] == 'mm':
        # Convert inches to mm first (1 inch = 25.4 mm)
        mm = inches * 25.4
        # Then apply the scale
        return mm * (float(scale_info['equals']) / float(scale_info['value']))
    
    # Default return in inches
    return inches

def convert_to_real_dimensions(width, height, scale_info):
    """
    Convert PDF dimensions to real-world dimensions based on scale information
    """
    try:
        # Convert width and height from PDF points to real-world units
        real_width = convert_pdf_points_to_real_units(width, scale_info)
        real_height = convert_pdf_points_to_real_units(height, scale_info)
        real_area = real_width * real_height
        
        # Convert to target unit if necessary
        if scale_info['equals_unit'] == 'meters':
            # Convert from feet to meters if needed
            if scale_info['unit'] == 'inch' or scale_info['unit'] == 'feet':
                real_width = real_width * 0.3048
                real_height = real_height * 0.3048
                real_area = real_width * real_height
        elif scale_info['equals_unit'] == 'feet':
            # Convert from meters to feet if needed
            if scale_info['unit'] == 'cm' or scale_info['unit'] == 'meters':
                real_width = real_width * 3.28084
                real_height = real_height * 3.28084
                real_area = real_width * real_height
        
        return {
            "width": round(real_width, 2),
            "height": round(real_height, 2),
            "area": round(real_area, 2),
            "unit": scale_info['equals_unit']
        }
    except (ValueError, TypeError) as e:
        logger.error(f"Error converting dimensions: {str(e)}")
        # Return original dimensions if conversion fails
        return {
            "width": width,
            "height": height,
            "area": width * height,
            "unit": "points"
        }

def check_compliance(room_type, real_dimensions, building_rules, residential_type=None):
    """
    Check if room dimensions comply with minimum requirements from database rules
    """
    try:
        # Find the matching rule for this room type
        room_rule = next((rule for rule in building_rules['rules'] 
                         if rule['roomType'].lower() == room_type.lower()), None)
        
        if room_rule:
            # Convert dimensions to the rule's unit if necessary
            rule_unit = room_rule['dimensions']['unit']
            if rule_unit != real_dimensions['unit']:
                if rule_unit == 'meters' and real_dimensions['unit'] == 'feet':
                    # Convert feet to meters
                    real_dimensions = {
                        'width': real_dimensions['width'] * 0.3048,
                        'height': real_dimensions['height'] * 0.3048,
                        'area': real_dimensions['area'] * 0.0929,
                        'unit': 'meters'
                    }
                elif rule_unit == 'feet' and real_dimensions['unit'] == 'meters':
                    # Convert meters to feet
                    real_dimensions = {
                        'width': real_dimensions['width'] * 3.28084,
                        'height': real_dimensions['height'] * 3.28084,
                        'area': real_dimensions['area'] * 10.7639,
                        'unit': 'feet'
                    }

            # Check minimum area
            if real_dimensions['area'] < room_rule['dimensions']['minArea']:
                return False, f"Area is below minimum requirement of {room_rule['dimensions']['minArea']} {room_rule['dimensions']['unit']}"
            
            # Check minimum width
            min_dimension = min(real_dimensions['width'], real_dimensions['height'])
            if min_dimension < room_rule['dimensions']['minWidth']:
                return False, f"Width/Length is below minimum requirement of {room_rule['dimensions']['minWidth']} {room_rule['dimensions']['unit']}"
            
            # Check maximum dimensions if specified
            if 'maxArea' in room_rule['dimensions'] and room_rule['dimensions']['maxArea']:
                if real_dimensions['area'] > room_rule['dimensions']['maxArea']:
                    return False, f"Area exceeds maximum requirement of {room_rule['dimensions']['maxArea']} {room_rule['dimensions']['unit']}"
            
            if 'maxWidth' in room_rule['dimensions'] and room_rule['dimensions']['maxWidth']:
                max_dimension = max(real_dimensions['width'], real_dimensions['height'])
                if max_dimension > room_rule['dimensions']['maxWidth']:
                    return False, f"Width/Length exceeds maximum requirement of {room_rule['dimensions']['maxWidth']} {room_rule['dimensions']['unit']}"
            
            # Check additional requirements if specified
            if room_rule.get('additionalRequirements'):
                return False, room_rule['additionalRequirements']
            
            return True, "Compliant with building rules"
        
        # If no specific rule found for this room type
        return True, "No specific rules found for this room type"
        
    except Exception as e:
        logger.error(f"Error checking compliance: {str(e)}")
        return False, f"Error checking compliance: {str(e)}"

def extract_shapes_from_pdf(pdf_path, scale_info, building_rules, residential_type=None):
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
                    
                    # Calculate width and height in PDF points
                    width = abs(x1 - x0)
                    height = abs(y1 - y0)
                    
                    # Convert coordinates to real-world units
                    real_x0 = convert_pdf_points_to_real_units(x0, scale_info)
                    real_y0 = convert_pdf_points_to_real_units(y0, scale_info)
                    real_x1 = convert_pdf_points_to_real_units(x1, scale_info)
                    real_y1 = convert_pdf_points_to_real_units(y1, scale_info)
                    
                    # Convert to real-world dimensions
                    real_dimensions = convert_to_real_dimensions(width, height, scale_info)
                    
                    # Check compliance with building rules
                    is_compliant, compliance_message = check_compliance(color_label, real_dimensions, building_rules, residential_type)

                    shape_info = {
                        "page": page_num + 1,
                        "space": color_label.capitalize(),
                        "color": color_label,
                        "rgb": tuple(round(c, 3) for c in fill_color),
                        "coordinates": {
                            "x0": round(x0, 2),
                            "y0": round(y0, 2),
                            "x1": round(x1, 2),
                            "y1": round(y1, 2)
                        },
                        "real_coordinates": {
                            "x0": round(real_x0, 2),
                            "y0": round(real_y0, 2),
                            "x1": round(real_x1, 2),
                            "y1": round(real_y1, 2),
                            "unit": scale_info['equals_unit']
                        },
                        "dimensions": {
                            "width": round(width, 2),
                            "height": round(height, 2)
                        },
                        "real_dimensions": real_dimensions,
                        "status": "Compliant" if is_compliant else "Non-Compliant",
                        "message": compliance_message,
                        "area": f"{real_dimensions['area']} sq {scale_info['equals_unit']}",
                        "width": f"{real_dimensions['width']} {scale_info['equals_unit']}",
                        "length": f"{real_dimensions['height']} {scale_info['equals_unit']}"
                    }
                    shapes_data.append(shape_info)
        
        doc.close()
        return shapes_data
    except Exception as e:
        logger.error(f"Error extracting shapes from PDF: {str(e)}")
        raise

def convert_to_serializable(obj):
    """Convert MongoDB objects to JSON serializable format"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    return obj

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
        
        # Get city, pincode, residential type and scale information from form data
        city = form.get('city')
        pincode = form.get('pincode')
        residential_type = form.get('residentialType')
        scale_value = form.get('scale_value')
        scale_unit = form.get('scale_unit')
        scale_equals = form.get('scale_equals')
        scale_equals_unit = form.get('scale_equals_unit')
        
        # Log all received form data for debugging
        logger.info(f"Received form data: {dict(form)}")
        
        # Validate required fields
        if not all([city, pincode, scale_value, scale_unit, scale_equals, scale_equals_unit]):
            return jsonify({
                "status": "error",
                "message": "Missing required fields: city, pincode, and scale information are required"
            }), 400

        # Fetch building rules from database
        building_rules = await simple_building_rules.find_one({
            "cityName": city,
            "pincode": pincode,
            "status": "active"
        })

        if not building_rules:
            return jsonify({
                "status": "error",
                "message": f"No active building rules found for {city}-{pincode}"
            }), 404

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
        logger.info(f"Residential Type: {residential_type}")
        logger.info(f"Scale: {scale_value}{scale_unit} = {scale_equals}{scale_equals_unit}")
        
        # Prepare scale information for dimension conversion
        scale_info = {
            "value": scale_value,
            "unit": scale_unit,
            "equals": scale_equals,
            "equals_unit": scale_equals_unit
        }
        
        # Extract shapes from the PDF
        shapes_data = extract_shapes_from_pdf(file_path, scale_info, building_rules, residential_type)

        # Count room types
        room_counts = {
            "bedroom": 0,
            "bathroom": 0,
            "hall": 0,
            "kitchen": 0,
            "dining": 0,
            "balcony": 0,
            "study": 0,
            "other": 0
        }
        
        # Count compliant and non-compliant rooms
        compliance_summary = {
            "total": len(shapes_data),
            "compliant": 0,
            "non_compliant": 0
        }
        
        for shape in shapes_data:
            color = shape.get("color", "other")
            if color in room_counts:
                room_counts[color] += 1
            else:
                room_counts["other"] += 1
                
            # Update compliance counts
            if shape.get("status") == "Compliant":
                compliance_summary["compliant"] += 1
            else:
                compliance_summary["non_compliant"] += 1
        
        # Clean up the temporary file
        os.remove(file_path)
        
        logger.info(f"Successfully processed {len(shapes_data)} shapes for {city}-{pincode}")
        logger.info(f"Compliance summary: {compliance_summary['compliant']} compliant, {compliance_summary['non_compliant']} non-compliant")
        
        # Convert building rules to JSON serializable format
        building_rules = convert_to_serializable(building_rules)
        
        return jsonify({
            "status": "success",
            "message": f"Successfully extracted {len(shapes_data)} shapes",
            "filename": file.filename,
            "city": city,
            "pincode": pincode,
            "residentialType": residential_type,
            "scale": {
                "value": scale_value,
                "unit": scale_unit,
                "equals": scale_equals,
                "equals_unit": scale_equals_unit
            },
            "shapes": shapes_data,
            "room_counts": room_counts,
            "compliance_summary": compliance_summary,
            "location": {
                "city": city,
                "pincode": pincode
            },
            "building_rules": building_rules['rules']
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

