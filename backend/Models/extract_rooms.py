import sys
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer

def extract_room_dimensions(pdf_path):
    room_data = []
    keywords = ['Room', 'OPEN KITCHEN', 'TOILET', 'BED ROOM', 'Living Room',
                'HALL', 'Bathroom', 'Dining', 'Store', 'Toilet', 'Kitchen']

    for page_layout in extract_pages(pdf_path):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                text = element.get_text().strip()
                if any(keyword in text for keyword in keywords):
                    x0, y0, x1, y1 = element.bbox
                    room_data.append({
                        'label': text,
                        'coordinates': {'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1}
                    })
    return room_data

if __name__ == '__main__':
    pdf_path = sys.argv[1]
    data = extract_room_dimensions(pdf_path)
    print(data)