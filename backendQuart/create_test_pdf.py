from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

def create_test_pdf():
    # Create a PDF file
    c = canvas.Canvas("test_plan.pdf")
    
    # Define colors for different rooms
    room_colors = {
        "bedroom": colors.green,
        "bathroom/toilet": colors.yellow,
        "hall": colors.red,
        "kitchen": colors.purple
    }
    
    # Draw rooms
    # Bedroom 1
    c.setFillColor(room_colors["bedroom"])
    c.rect(100, 400, 200, 150, fill=1)
    
    # Bedroom 2
    c.setFillColor(room_colors["bedroom"])
    c.rect(350, 400, 200, 150, fill=1)
    
    # Bathroom
    c.setFillColor(room_colors["bathroom/toilet"])
    c.rect(100, 200, 100, 150, fill=1)
    
    # Hall
    c.setFillColor(room_colors["hall"])
    c.rect(250, 200, 300, 150, fill=1)
    
    # Kitchen
    c.setFillColor(room_colors["kitchen"])
    c.rect(100, 50, 150, 100, fill=1)
    
    # Save the PDF
    c.save()
    print("Test PDF created successfully")

if __name__ == "__main__":
    create_test_pdf() 