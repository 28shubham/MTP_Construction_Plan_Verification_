import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaUserShield, FaCheckCircle, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllAdmins, deleteAdmin, updateAdmin, registerAdmin } from '../services/adminService';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

const PageContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1a2a6c 0%, #2a4858 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.875rem;
  font-weight: 600;

  svg {
    font-size: 2rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 2rem;
  flex: 1;
  max-width: 400px;

  svg {
    color: rgba(255, 255, 255, 0.7);
    margin-right: 0.5rem;
  }

  input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    padding: 0.5rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
      outline: none;
    }
  }
`;

const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #43A047;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const TableContainer = styled.div`
  padding: 2rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.25rem 1rem;
  background: #f8fafc;
  color: #1a2a6c;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  transition: background-color 0.2s;

  ${({ isFirst }) => isFirst && `
    font-weight: 500;
    color: #2d3748;
  `}
`;

const Tr = styled.tr`
  &:hover td {
    background-color: #f8fafc;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: ${props => props.delete ? 'rgba(220, 38, 38, 0.1)' : 'rgba(26, 42, 108, 0.1)'};
  color: ${props => props.delete ? '#dc2626' : '#1a2a6c'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;

  &:hover {
    background: ${props => props.delete ? 'rgba(220, 38, 38, 0.2)' : 'rgba(26, 42, 108, 0.2)'};
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  
  h2 {
    margin: 0 0 1.5rem;
    color: #1a2a6c;
    font-size: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #1a2a6c;
    color: white;
    
    &:hover {
      background: #151f4d;
    }
  ` : `
    background: #f1f5f9;
    color: #64748b;
    
    &:hover {
      background: #e2e8f0;
    }
  `}
`;

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await getAllAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      await deleteAdmin(adminId);
      setAdmins(admins.filter(admin => admin._id !== adminId));
      toast.success('Admin deleted successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin({
      ...admin,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAdmin({
      name: '',
      email: '',
      password: '',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin._id) {
        const { _id, ...updateData } = editingAdmin;
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateAdmin(_id, updateData);
        setAdmins(admins.map(admin => 
          admin._id === _id ? { ...admin, ...updateData } : admin
        ));
        toast.success('Admin updated successfully');
      } else {
        const response = await registerAdmin(editingAdmin);
        setAdmins([...admins, response.data]);
        toast.success('Admin created successfully');
      }
      setIsModalOpen(false);
      setEditingAdmin(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <PageContent>
        <Header>
          <Title>
            <FaUserShield />
            Admin Management
          </Title>
          <SearchBar>
            <FaSearch />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <AddButton onClick={handleAdd}>
            <FaPlus />
            Add Admin
          </AddButton>
        </Header>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Permissions</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map(admin => (
                <Tr key={admin._id}>
                  <Td isFirst>{admin.name}</Td>
                  <Td>{admin.email}</Td>
                  <Td>
                    {admin.permissions?.map(permission => (
                      <div key={permission} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <FaCheckCircle style={{ color: '#059669', marginRight: '0.5rem' }} />
                        {permission.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </div>
                    ))}
                  </Td>
                  <Td>
                    <ActionButton onClick={() => handleEdit(admin)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(admin._id)}>
                      <FaTrash />
                    </ActionButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </PageContent>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>{editingAdmin._id ? 'Edit Admin' : 'Add Admin'}</h2>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={editingAdmin.name}
                  onChange={e => setEditingAdmin({...editingAdmin, name: e.target.value})}
                  required
                  placeholder="Enter admin name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingAdmin.email}
                  onChange={e => setEditingAdmin({...editingAdmin, email: e.target.value})}
                  required
                  placeholder="Enter admin email"
                />
              </FormGroup>

              <FormGroup>
                <Label>{editingAdmin._id ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
                <Input
                  type="password"
                  value={editingAdmin.password}
                  onChange={e => setEditingAdmin({...editingAdmin, password: e.target.value})}
                  required={!editingAdmin._id}
                  minLength="3"
                  placeholder={editingAdmin._id ? 'Enter new password (optional)' : 'Enter password'}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" primary>
                  {editingAdmin._id ? 'Save Changes' : 'Add Admin'}
                </Button>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminListPage; 