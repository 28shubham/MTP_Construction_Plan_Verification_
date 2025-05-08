import React, { useRef, useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import styled from "styled-components";

const colorMap = {
  bedroom: { label: "Bedroom", color: rgb(0.3, 0.69, 0.31), hex: "#4caf50" },
  "bathroom/toilet": {
    label: "Bathroom/Toilet",
    color: rgb(1.0, 0.93, 0.23),
    hex: "#ffe600",
  },
  hall: { label: "Hall", color: rgb(0.96, 0.26, 0.21), hex: "#f44336" },
  kitchen: { label: "Kitchen", color: rgb(0.61, 0.16, 0.69), hex: "#9c27b0" },
};

const Container = styled.div`
  display: flex;
  min-height: 80vh;
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 260px;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: #fff;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Main = styled.div`
  flex: 1;
  padding: 2rem;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ShapeLegend = styled.div`
  margin-top: 2rem;
  h4 {
    margin-bottom: 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .color-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-block;
    border: 2px solid #fff;
  }
`;

const Button = styled.button`
  background: #fff;
  color: #1a2a6c;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  transition: background 0.2s;
  &:hover {
    background: #e3e6f3;
  }
`;

const CanvasWrapper = styled.div`
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
`;

function MakePdf() {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("bedroom");
  const [pageImage, setPageImage] = useState(null);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [shapes, setShapes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const canvasRef = useRef();

  // Load PDF and render first page as image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);
      if (!pdfBytes || pdfBytes.byteLength === 0) {
        console.error("Invalid or empty PDF data.");
        alert("The uploaded PDF is invalid. Please try again.");
        return;
      }
      // Render first page as image using pdfjs
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageDims({ width: viewport.width, height: viewport.height });
      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;
      setPageImage(canvas.toDataURL());
      setShapes([]);
    }
  };

  // Drawing logic
  const handleCanvasMouseDown = (e) => {
    if (!pageDims.width) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * pageDims.width;
    const y = ((e.clientY - rect.top) / rect.height) * pageDims.height;
    setStartPoint({ x, y });
    setDrawing(true);
  };

  const handleCanvasMouseUp = (e) => {
    if (!drawing || !startPoint) return;
    const rect = e.target.getBoundingClientRect();
    const x2 = ((e.clientX - rect.left) / rect.width) * pageDims.width;
    const y2 = ((e.clientY - rect.top) / rect.height) * pageDims.height;
    setShapes([
      ...shapes,
      {
        type: "rect",
        room: selectedRoom,
        x: Math.min(startPoint.x, x2),
        y: Math.min(startPoint.y, y2),
        width: Math.abs(x2 - startPoint.x),
        height: Math.abs(y2 - startPoint.y),
      },
    ]);
    setDrawing(false);
    setStartPoint(null);
  };

  const handleCanvasMouseMove = (e) => {
    if (!drawing || !startPoint) return;
    const rect = e.target.getBoundingClientRect();
    const x2 = ((e.clientX - rect.left) / rect.width) * pageDims.width;
    const y2 = ((e.clientY - rect.top) / rect.height) * pageDims.height;
    // Draw preview rectangle
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, pageDims.width, pageDims.height);
    const img = new window.Image();
    img.src = pageImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pageDims.width, pageDims.height);
      // Draw existing shapes
      shapes.forEach((shape) => {
        ctx.fillStyle = colorMap[shape.room].hex + "88";
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = colorMap[shape.room].hex;
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      });
      // Draw preview
      ctx.fillStyle = colorMap[selectedRoom].hex + "44";
      ctx.fillRect(
        Math.min(startPoint.x, x2),
        Math.min(startPoint.y, y2),
        Math.abs(x2 - startPoint.x),
        Math.abs(y2 - startPoint.y)
      );
      ctx.strokeStyle = colorMap[selectedRoom].hex;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        Math.min(startPoint.x, x2),
        Math.min(startPoint.y, y2),
        Math.abs(x2 - startPoint.x),
        Math.abs(y2 - startPoint.y)
      );
    };
  };

  // Redraw shapes on canvas when shapes or pageImage changes
  useEffect(() => {
    if (!canvasRef.current || !pageImage) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, pageDims.width, pageDims.height);
    const img = new window.Image();
    img.src = pageImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pageDims.width, pageDims.height);
      shapes.forEach((shape) => {
        ctx.fillStyle = colorMap[shape.room].hex + "88";
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = colorMap[shape.room].hex;
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      });
    };
  }, [shapes, pageImage, pageDims]);

  // Undo last shape
  const handleUndo = () => {
    setShapes(shapes.slice(0, -1));
  };

  // Download the edited PDF
  const handleDownload = async () => {
    if (!pdfBytes || pdfBytes.byteLength === 0) {
      console.error("Invalid or empty PDF data.");
      alert("The uploaded PDF is invalid. Please try again.");
      return;
    }

    try {
      // Create a copy of the ArrayBuffer to avoid detachment issues
      const pdfBytesCopy = pdfBytes.slice(0);

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);

      // Get the first page
      const page = pdfDoc.getPages()[0];

      // Validate and draw shapes on the page
      shapes.forEach((shape) => {
        if (
          shape.x < 0 ||
          shape.y < 0 ||
          shape.width <= 0 ||
          shape.height <= 0 ||
          !colorMap[shape.room]
        ) {
          console.error("Invalid shape data:", shape);
          throw new Error("Invalid shape data.");
        }

        page.drawRectangle({
          x: shape.x,
          y: pageDims.height - shape.y - shape.height,
          width: shape.width,
          height: shape.height,
          color: colorMap[shape.room].color,
          borderColor: colorMap[shape.room].color,
          borderWidth: 2,
        });
      });

      // Save the modified PDF
      const newPdfBytes = await pdfDoc.save();

      // Create a Blob and download the file
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading edited PDF:", error);
      alert("An error occurred while downloading the PDF. Please try again.");
    }
  };

  return (
    <Container>
      <Sidebar>
        <div>
          <h2 style={{ marginBottom: "1.5rem" }}>MAKE PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Room Type:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            {Object.entries(colorMap).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleUndo} disabled={shapes.length === 0}>
          Undo Last Shape
        </Button>
        <Button
          onClick={handleDownload}
          disabled={!pdfBytes || shapes.length === 0}
        >
          Download Edited PDF
        </Button>
        <ShapeLegend>
          <h4>Legend</h4>
          <ul>
            {Object.entries(colorMap).map(([key, val]) => (
              <li key={key}>
                <span
                  className="color-dot"
                  style={{ background: val.hex }}
                ></span>
                {val.label}
              </li>
            ))}
          </ul>
        </ShapeLegend>
      </Sidebar>
      <Main>
        <h3 style={{ marginBottom: 16 }}>Draw shapes on the PDF</h3>
        {pageImage && (
          <CanvasWrapper
            style={{
              width: pageDims.width,
              height: pageDims.height,
            }}
          >
            <canvas
              ref={canvasRef}
              width={pageDims.width}
              height={pageDims.height}
              style={{
                width: pageDims.width,
                height: pageDims.height,
                cursor: "crosshair",
                display: "block",
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              onMouseMove={handleCanvasMouseMove}
            />
          </CanvasWrapper>
        )}
        {!pageImage && (
          <div style={{ color: "#888", marginTop: 40 }}>
            Upload a PDF to start editing.
          </div>
        )}
      </Main>
    </Container>
  );
}

export default MakePdf;
