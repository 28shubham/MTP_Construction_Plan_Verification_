import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPalette, FaPlus, FaTrash, FaSave, FaInfoCircle } from 'react-icons/fa';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  h1 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    
    svg {
      font-size: 2.5rem;
    }
  }
  
  p {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ColorCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${props => props.color};
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ColorForm = styled.div`
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.25rem;
    color: #4a5568;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #718096;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid ${props => props.error ? '#f56565' : '#e2e8f0'};
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }

  &[type="color"] {
    height: 40px;
    padding: 0.25rem;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const Button = styled.button`
  background: ${props => {
    if (props.danger) return '#f56565';
    if (props.primary) return 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)';
    return 'white';
  }};
  color: ${props => props.danger || props.primary ? 'white' : '#1a2a6c'};
  border: 2px solid ${props => props.danger ? '#f56565' : props.primary ? 'transparent' : '#1a2a6c'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: ${props => props.fullWidth ? '1' : 'initial'};
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => {
      if (props.danger) return '#e53e3e';
      if (props.primary) return 'linear-gradient(135deg, #15216c 0%, #a31f1f 100%)';
      return '#f8fafc';
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddColorButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  svg {
    font-size: 1.5rem;
  }

  span {
    display: none;
  }

  &:hover {
    width: auto;
    border-radius: 30px;
    padding: 1rem 2rem;
    
    span {
      display: inline;
      margin-left: 0.5rem;
    }
  }
`;

const SaveButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: ${props => props.showAddButton ? '7rem' : '2rem'};
  padding: 1rem 2rem;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

function ColorManagement() {
  // Initial mock data
  const initialColors = [
    {
      id: 1,
      name: 'bedroom',
      label: 'Bedroom',
      hexColor: '#4caf50'
    },
    {
      id: 2,
      name: 'bathroom',
      label: 'Bathroom',
      hexColor: '#ffe600'
    },
    {
      id: 3,
      name: 'hall',
      label: 'Hall',
      hexColor: '#f44336'
    },
    {
      id: 4,
      name: 'kitchen',
      label: 'Kitchen',
      hexColor: '#9c27b0'
    }
  ];

  const [colors, setColors] = useState(initialColors);

  const handleAddColor = () => {
    setColors([
      ...colors,
      {
        id: Date.now(),
        name: '',
        label: '',
        hexColor: '#1a2a6c'
      }
    ]);
  };

  const handleColorChange = (id, field, value) => {
    setColors(colors.map(color => 
      color.id === id ? { ...color, [field]: value } : color
    ));
  };

  const handleDelete = (id) => {
    setColors(colors.filter(color => color.id !== id));
  };

  const handleSave = () => {
    // Just log the colors to console for now
    console.log('Saved colors:', colors);
    alert('Colors saved successfully!');
  };

  return (
    <AdminDashboardLayout>
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <Title>
              <h1>
                <FaPalette />
                Color Management
              </h1>
              <p>Customize room colors for the PDF marker tool</p>
            </Title>
          </HeaderContent>
        </PageHeader>

        <ColorGrid>
          {colors.map(color => (
            <ColorCard key={color.id}>
              <ColorPreview color={color.hexColor} />
              <ColorForm>
                <FormGroup>
                  <label>Room Type</label>
                  <Input
                    type="text"
                    placeholder="e.g., bedroom"
                    value={color.name}
                    onChange={(e) => handleColorChange(color.id, 'name', e.target.value)}
                  />
                  <div className="hint">
                    <FaInfoCircle />
                    Use lowercase without spaces
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>Display Label</label>
                  <Input
                    type="text"
                    placeholder="e.g., Bedroom"
                    value={color.label}
                    onChange={(e) => handleColorChange(color.id, 'label', e.target.value)}
                  />
                  <div className="hint">
                    <FaInfoCircle />
                    This will be shown to users
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>Color</label>
                  <Input
                    type="color"
                    value={color.hexColor}
                    onChange={(e) => handleColorChange(color.id, 'hexColor', e.target.value)}
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button danger fullWidth onClick={() => handleDelete(color.id)}>
                    <FaTrash />
                    Delete
                  </Button>
                </ButtonGroup>
              </ColorForm>
            </ColorCard>
          ))}
        </ColorGrid>

        <AddColorButton primary onClick={handleAddColor}>
          <FaPlus />
          <span>Add Color</span>
        </AddColorButton>

        <SaveButton primary onClick={handleSave} showAddButton={true}>
          <FaSave />
          Save Changes
        </SaveButton>
      </PageContainer>
    </AdminDashboardLayout>
  );
}

export default ColorManagement; 