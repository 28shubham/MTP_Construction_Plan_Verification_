import pdfplumber
from shapely.geometry import Polygon

def extract_boundaries_and_labels(pdf_path, scale_factor):
    """
    Extract room boundaries and labels from the PDF.

    Parameters:
    - pdf_path (str): Path to the PDF file.
    - scale_factor (float): Scaling factor to convert PDF units to real-world dimensions.

    Returns:
    - list: A list of dictionaries containing room labels and boundaries.
    """
    room_boundaries = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            print(f"Processing page {page_number}...")
            
            # Extract room labels and their bounding boxes
            text_boxes = []
            for word in page.extract_words():
                text = word["text"].lower()
                if any(keyword in text for keyword in ["bedroom", "kitchen", "toilet", "hall"]):
                    text_boxes.append({
                        "label": text,
                        "bbox": (word["x0"], word["top"], word["x1"], word["bottom"])
                    })

            # Extract vector shapes (lines and rectangles)
            shapes = []
            for line in page.lines + page.rects:
                if "x0" in line and "x1" in line and "top" in line and "bottom" in line:
                    shapes.append(Polygon([
                        (line["x0"], line["top"]),
                        (line["x1"], line["top"]),
                        (line["x1"], line["bottom"]),
                        (line["x0"], line["bottom"])
                    ]))

            # Match text boxes with nearby shapes
            for text_box in text_boxes:
                x0, y0, x1, y1 = text_box["bbox"]
                text_polygon = Polygon([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])
                for shape in shapes:
                    if shape.contains(text_polygon.centroid):
                        # Calculate area in real-world units
                        pdf_area = shape.area
                        real_world_area = pdf_area * (scale_factor ** 2)

                        room_boundaries.append({
                            "label": text_box["label"],
                            "bounding_box": list(shape.exterior.coords),
                            "real_world_area (sq feet)": round(real_world_area, 2)
                        })

    return room_boundaries

def main():
    # Path to the PDF file
    pdf_path = "/mnt/data/hbninfotech_2BHK_HOUSE_PLAN.pdf"  # Replace with your file path

    # Define the scaling factor (e.g., 1 cm = 1 foot)
    cm_to_feet_conversion = 1 / 2.54 * 12  # 1 inch = 2.54 cm, 12 inches = 1 foot
    scale_factor = cm_to_feet_conversion

    # Extract room boundaries and labels
    boundaries = extract_boundaries_and_labels(pdf_path, scale_factor)

    # Display the results
    if boundaries:
        print("\nExtracted Room Boundaries:")
        print("-" * 60)
        for boundary in boundaries:
            print(f"Room Label: {boundary['label']}")
            print(f"Bounding Box: {boundary['bounding_box']}")
            print(f"Real-World Area: {boundary['real_world_area (sq feet)']} sq feet")
            print("-" * 60)
    else:
        print("No room boundaries found in the PDF.")

if __name__ == "__main__":
    main()
