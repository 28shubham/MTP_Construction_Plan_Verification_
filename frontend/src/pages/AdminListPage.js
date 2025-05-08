import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaUserShield, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllAdmins, deleteAdmin, updateAdmin, registerAdmin } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.875rem;

  svg {
    color: #1a2a6c;
  }
`;

const AddButton = styled.button`
  background: #1a2a6c;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${props => props.delete ? '#dc2626' : '#1a2a6c'};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
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
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #1a2a6c;
    box-shadow: 0 0 0 2px rgba(26, 42, 108, 0.1);
  }
`;

const Button = styled.button`
  background: ${props => props.secondary ? '#f3f4f6' : '#1a2a6c'};
  color: ${props => props.secondary ? '#374151' : 'white'};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      password: '' // Clear password for security
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
        // Update existing admin
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
        // Create new admin
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <Title>
          <FaUserShield />
          Admin Management
        </Title>
        <AddButton onClick={handleAdd}>
          <FaPlus />
          Add Admin
        </AddButton>
      </Header>

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
          {admins.map(admin => (
            <tr key={admin._id}>
              <Td>{admin.name}</Td>
              <Td>{admin.email}</Td>
              <Td>
                {admin.permissions?.map(permission => (
                  <div key={permission}>
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
            </tr>
          ))}
        </tbody>
      </Table>

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
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editingAdmin.email}
                  onChange={e => setEditingAdmin({...editingAdmin, email: e.target.value})}
                  required
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
                />
              </FormGroup>

              <Button type="submit">Save Changes</Button>
              <Button type="button" secondary onClick={handleCancel}>
                Cancel
              </Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default AdminListPage; 