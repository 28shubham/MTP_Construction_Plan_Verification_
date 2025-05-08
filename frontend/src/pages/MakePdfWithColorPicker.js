import React, { useRef, useState, useEffect } from 'react';
import { rgb } from 'pdf-lib';
import styled from 'styled-components';

const colorMap = {
  bedroom: { label: 'Bedroom', color: rgb(0.3, 0.69, 0.31), hex: '#4caf50' },
  'bathroom/toilet': { label: 'Bathroom/Toilet', color: rgb(1.0, 0.93, 0.23), hex: '#ffe600' },
  hall: { label: 'Hall', color: rgb(0.96, 0.26, 0.21), hex: '#f44336' },
  kitchen: { label: 'Kitchen', color: rgb(0.61, 0.16, 0.69), hex: '#9c27b0' },
};

const Container = styled.div`
  display: flex;
  min-height: 80vh;
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.12);
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
  h4 { margin-bottom: 0.5rem; }
  ul { list-style: none; padding: 0; }
  li { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
  }
  .shape-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  .color-dot {
    width: 18px; 
    height: 18px; 
    border-radius: 50%; 
    display: inline-block;
    border: 2px solid #fff;
  }
  .shape-color-picker {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    background: none;
  }
  .shape-label {
    color: white;
    font-size: 0.9rem;
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
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
  transition: background 0.2s;
  &:hover { background: #e3e6f3; }
`;

const CanvasWrapper = styled.div`
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(44,62,80,0.08);
`;

const ColorPickerWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  input[type="color"] {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
  }
`;

function MakePdfWithColorPicker() {
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('bedroom');
  const [selectedColor, setSelectedColor] = useState(colorMap['bedroom'].hex);
  const [pageImage, setPageImage] = useState(null);
  const [pageDims, setPageDims] = useState({ width: 0, height: 0 });
  const [shapes, setShapes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [nextShapeId, setNextShapeId] = useState(1);
  const [downloadURL, setDownloadURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    return () => {
      if (downloadURL) {
        URL.revokeObjectURL(downloadURL);
      }
    };
  }, [downloadURL]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      if (downloadURL) {
        URL.revokeObjectURL(downloadURL);
      }
      
      setPdfFile(file);
      
      const newDownloadURL = URL.createObjectURL(file);
      setDownloadURL(newDownloadURL);
      
      try {
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        const fileData = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setPageDims({ width: viewport.width, height: viewport.height });
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;
        setPageImage(canvas.toDataURL());
        setShapes([]);
      } catch (error) {
        console.error("Error processing PDF for preview:", error);
        setPageImage(null);
        setDownloadURL(null);
        alert("Error loading PDF. Please try another file.");
      } finally {
        setIsLoading(false);
      }
    }
  };

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
        id: nextShapeId,
        type: 'rect',
        room: selectedRoom,
        color: selectedColor,
        x: Math.min(startPoint.x, x2),
        y: Math.min(startPoint.y, y2),
        width: Math.abs(x2 - startPoint.x),
        height: Math.abs(y2 - startPoint.y),
      },
    ]);
    setNextShapeId(nextShapeId + 1);
    setDrawing(false);
    setStartPoint(null);
  };

  const handleCanvasMouseMove = (e) => {
    if (!drawing || !startPoint) return;
    const rect = e.target.getBoundingClientRect();
    const x2 = ((e.clientX - rect.left) / rect.width) * pageDims.width;
    const y2 = ((e.clientY - rect.top) / rect.height) * pageDims.height;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, pageDims.width, pageDims.height);
    const img = new window.Image();
    img.src = pageImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pageDims.width, pageDims.height);
      shapes.forEach(shape => {
        ctx.fillStyle = shape.color + '88';
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      });
      ctx.fillStyle = selectedColor + '44';
      ctx.fillRect(
        Math.min(startPoint.x, x2),
        Math.min(startPoint.y, y2),
        Math.abs(x2 - startPoint.x),
        Math.abs(y2 - startPoint.y)
      );
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        Math.min(startPoint.x, x2),
        Math.min(startPoint.y, y2),
        Math.abs(x2 - startPoint.x),
        Math.abs(y2 - startPoint.y)
      );
    };
  };

  useEffect(() => {
    if (!canvasRef.current || !pageImage) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, pageDims.width, pageDims.height);
    const img = new window.Image();
    img.src = pageImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, pageDims.width, pageDims.height);
      shapes.forEach(shape => {
        ctx.fillStyle = shape.color + '88';
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      });
    };
  }, [shapes, pageImage, pageDims]);

  const handleUndo = () => {
    setShapes(shapes.slice(0, -1));
  };

  const handleDownloadAsImage = () => {
    if (!canvasRef.current) return;
    
    try {
      const imageURL = canvasRef.current.toDataURL('image/png');
      
      const a = document.createElement('a');
      a.href = imageURL;
      a.download = 'annotated-floor-plan.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Error creating image. Please try again.");
    }
  };

  const handleDownloadOriginal = () => {
    if (!downloadURL) return;
    
    try {
      const a = document.createElement('a');
      a.href = downloadURL;
      a.download = pdfFile ? pdfFile.name : 'original.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading original PDF:", error);
      alert("Error downloading PDF. Please try again.");
    }
  };

  const handleShapeColorChange = (shapeId, newColor) => {
    setShapes(shapes.map(shape => 
      shape.id === shapeId ? { ...shape, color: newColor } : shape
    ));
  };

  return (
    <Container>
      <Sidebar>
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>MAKE PDF</h2>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            disabled={isLoading} 
          />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Room Type:</label>
          <select
            value={selectedRoom}
            onChange={e => {
              setSelectedRoom(e.target.value);
              setSelectedColor(colorMap[e.target.value].hex);
            }}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, marginTop: 8 }}
            disabled={isLoading}
          >
            {Object.entries(colorMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <ColorPickerWrapper>
          <label style={{ fontWeight: 600 }}>Pick Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={e => setSelectedColor(e.target.value)}
            disabled={isLoading}
          />
        </ColorPickerWrapper>
        <Button 
          onClick={handleUndo} 
          disabled={shapes.length === 0 || isLoading}
        >
          Undo Last Shape
        </Button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Button 
            onClick={handleDownloadAsImage} 
            disabled={!pageImage || shapes.length === 0 || isLoading}
            style={{ backgroundColor: '#4caf50', color: 'white' }}
          >
            Download as Image
          </Button>
          
          <Button 
            onClick={handleDownloadOriginal} 
            disabled={!downloadURL || isLoading}
            style={{ backgroundColor: '#f1f1f1', color: '#333' }}
          >
            Download Original PDF
          </Button>
        </div>
        
        <ShapeLegend>
          <h4>Shapes</h4>
          <ul>
            {shapes.map((shape, index) => (
              <li key={shape.id}>
                <div className="shape-info">
                  <span className="color-dot" style={{ background: shape.color }}></span>
                  <span className="shape-label">
                    {shape.room} {index + 1}
                  </span>
                </div>
                <input
                  type="color"
                  value={shape.color}
                  onChange={(e) => handleShapeColorChange(shape.id, e.target.value)}
                  className="shape-color-picker"
                  disabled={isLoading}
                />
              </li>
            ))}
          </ul>
          {shapes.length === 0 && (
            <div style={{ color: '#888', fontSize: '0.9rem' }}>
              Draw shapes to see them here
            </div>
          )}
        </ShapeLegend>
      </Sidebar>
      <Main>
        <h3 style={{ marginBottom: 16 }}>Draw shapes on the PDF</h3>
        {isLoading && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            zIndex: 10
          }}>
            Processing...
          </div>
        )}
        {pageImage && (
          <CanvasWrapper
            style={{
              width: pageDims.width,
              height: pageDims.height,
              position: 'relative',
            }}
          >
            <canvas
              ref={canvasRef}
              width={pageDims.width}
              height={pageDims.height}
              style={{ 
                width: pageDims.width, 
                height: pageDims.height, 
                cursor: isLoading ? 'wait' : 'crosshair', 
                display: 'block' 
              }}
              onMouseDown={!isLoading ? handleCanvasMouseDown : undefined}
              onMouseUp={!isLoading ? handleCanvasMouseUp : undefined}
              onMouseMove={!isLoading ? handleCanvasMouseMove : undefined}
            />
          </CanvasWrapper>
        )}
        {!pageImage && !isLoading && (
          <div style={{ color: '#888', marginTop: 40 }}>Upload a PDF to start editing.</div>
        )}
      </Main>
    </Container>
  );
}

export default MakePdfWithColorPicker; 