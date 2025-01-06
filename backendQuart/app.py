import io
import re
import os
from quart import Quart, request, jsonify
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer
from quart_cors import cors

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Quart(__name__)
app = cors(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_room_dimensions(pdf_file):
    room_data = []
    keywords = [
        'Room', 'OPEN KITCHEN', 'TOILET', 'BED ROOM', 'Living Room',
        'HALL', 'Bathroom', 'Dining', 'Store', 'Toilet', 'Kitchen', 'WC',
        'Wash', 'Master Bedroom', 'Guest Room', 'Study Room', 'Office',
        'Pantry', 'Balcony', 'Lobby', 'Passage', 'Corridor', 'Garage', 'Pooja'
    ]
    
    dimension_pattern = r"(\d+'(?:-\d+(?:\½)?)?\"?)\s*[xX×]\s*(\d+'(?:-\d+(?:\½)?)?\"?)"
    
    for page_layout in extract_pages(pdf_file):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                text = element.get_text().strip().replace('\n', ' ')
                
                for keyword in keywords:
                    if keyword.lower() in text.lower():
                        matches = re.findall(dimension_pattern, text)
                        x0, y0, x1, y1 = element.bbox
                        if matches:
                            for match in matches:
                                length, width = match
                                room_data.append({
                                    'label': keyword,
                                    'length': length,
                                    'width': width,
                                    'coordinates': {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1}
                                })
                        else:
                            room_data.append({
                                'label': keyword,
                                'length': 'N/A',
                                'width': 'N/A',
                                'coordinates': {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1}
                            })
    return room_data

def convert_to_feet(value):
    match = re.match(r"(\d+)'(?:-(\d+))?(?:\½)?\"?", value)
    if match:
        feet = int(match.group(1))
        inches = int(match.group(2)) if match.group(2) else 0
        half_inch = 0.5 if '½' in value else 0
        return feet + (inches / 12) + half_inch
    return None

def verify_room_dimensions(space, length, width):
    rules = {
        'Room': (10, 10, 12, 14),
        'Kitchen': (7, 8, 10, 12),
        'Toilet': (4, 6, 7, 10),
        'Hall': (12, 15, 16, 20),
    }
    if space in rules:
        min_length, min_width, max_length, max_width = rules[space]
        return (min_length <= length <= max_length) and (min_width <= width <= max_width)
    return True

def map_room_data(room_data):
    refined_data = []
    seen_coordinates = set()
    
    for room in room_data:
        if room['length'] != 'N/A' and room['width'] != 'N/A':
            length_ft = convert_to_feet(room['length'])
            width_ft = convert_to_feet(room['width'])

            if length_ft and width_ft:
                area_ft = length_ft * width_ft
                is_valid = verify_room_dimensions(room['label'], length_ft, width_ft)
                status = "✅ Valid" if is_valid else "❌ Invalid"

                coordinates_tuple = (room['coordinates']['x0'], room['coordinates']['y0'], room['coordinates']['x1'], room['coordinates']['y1'])
                
                if coordinates_tuple not in seen_coordinates:
                    seen_coordinates.add(coordinates_tuple)
                    refined_data.append({
                        'space': room['label'],
                        'length': f"{length_ft:.2f} ft",
                        'width': f"{width_ft:.2f} ft",
                        'area': f"{area_ft:.2f} sq ft",
                        'status': status,
                        'coordinates': room['coordinates']
                    })
    return refined_data

@app.route('/verify-pdf', methods=['POST'])
async def verify_pdf():
    form_data = await request.files

    if 'file' not in form_data:
        return jsonify({"error": "No file part"}), 400

    file = form_data['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        await file.save(file_path)
        
        with open(file_path, 'rb') as pdf_file:
            room_data = extract_room_dimensions(pdf_file)
        
        mapped_data = map_room_data(room_data)
        
        os.remove(file_path)
        
        return jsonify(mapped_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)

