import React, { useRef, useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import styled from "styled-components";
import { FaUpload, FaUndo, FaDownload, FaPalette, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import Navbar from "./components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px; // Added to account for navbar
`;

const Container = styled.div`
  display: flex;
  min-height: 80vh;
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const Sidebar = styled.div`
  width: 320px;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  overflow-y: auto;
`;

const Main = styled.div`
  flex: 1;
  padding: 2rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  
  svg {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
`;

const FileUploadContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
  }

  svg {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  input {
    display: none;
  }
`;

const RoomTypeSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  margin-top: 0.5rem;

  option {
    background: #1a2a6c;
    color: white;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  display: block;
`;

const ShapeLegend = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: auto;

  h4 {
    margin: 0 0 1rem 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 'white' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.primary ? '#1a2a6c' : 'white'};
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.primary ? '#f8f9fa' : 'rgba(255, 255, 255, 0.15)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CanvasWrapper = styled.div`
  position: relative;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: #6b7280;

  svg {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    color: #9ca3af;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 1rem;
    max-width: 400px;
    line-height: 1.6;
  }
`;

const MainHeader = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Instructions = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;

  svg {
    color: #1a2a6c;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.5;
  }
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
  const fileInputRef = useRef();

  // Load PDF and render first page as image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!file.type.includes('pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);

      // Render first page as image using pdfjs
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      try {
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
        toast.success('PDF loaded successfully');
      } catch (error) {
        console.error("Error rendering PDF:", error);
        toast.error('Error loading PDF. Please try another file.');
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error('Error reading file. Please try again.');
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
    if (!pdfBytes || shapes.length === 0) {
      toast.error('Please upload a PDF and draw at least one shape');
      return;
    }

    try {
      const pdfBytesCopy = pdfBytes.slice(0);
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);
      const page = pdfDoc.getPages()[0];

      shapes.forEach((shape) => {
        if (
          shape.x < 0 ||
          shape.y < 0 ||
          shape.width <= 0 ||
          shape.height <= 0 ||
          !colorMap[shape.room]
        ) {
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

      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "marked_plan.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error("Error downloading edited PDF:", error);
      toast.error('Error downloading PDF. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Sidebar>
            <div>
              <Title>
                <FaPalette />
                PDF Marker
              </Title>
              <Description>
                Upload a PDF and mark different rooms using the color-coded system.
                Draw rectangles to highlight specific areas in your floor plan.
              </Description>

              <FileUploadContainer onClick={() => fileInputRef.current.click()}>
                <FaUpload />
                <p>Click to upload PDF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </FileUploadContainer>
            </div>

            <div>
              <Label>Room Type</Label>
              <RoomTypeSelect
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {Object.entries(colorMap).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </RoomTypeSelect>
            </div>

            <ButtonGroup>
              <Button onClick={handleUndo} disabled={shapes.length === 0}>
                <FaUndo />
                Undo Last
              </Button>
              <Button
                primary
                onClick={handleDownload}
                disabled={!pdfBytes || shapes.length === 0}
              >
                <FaDownload />
                Download
              </Button>
            </ButtonGroup>

            <ShapeLegend>
              <h4>Color Legend</h4>
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
            <MainHeader>
              <h2>Floor Plan Editor</h2>
              <Button onClick={() => window.history.back()}>
                <FaArrowLeft />
                Back
              </Button>
            </MainHeader>

            {pageImage ? (
              <>
                <Instructions>
                  <FaInfoCircle />
                  <p>
                    Click and drag on the floor plan to draw rectangles. Select a room
                    type from the sidebar before drawing. Use the undo button to
                    remove mistakes.
                  </p>
                </Instructions>

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
              </>
            ) : (
              <EmptyState>
                <FaUpload />
                <h3>No PDF Selected</h3>
                <p>
                  Upload a PDF file from the sidebar to start marking rooms on your
                  floor plan.
                </p>
              </EmptyState>
            )}
          </Main>
        </Container>
      </PageContainer>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MakePdf;
