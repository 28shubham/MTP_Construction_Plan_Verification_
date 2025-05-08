import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaUserShield, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllAdmins, deleteAdmin, updateAdmin } from '../services/adminService';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1f2937;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;

  svg {
    color: #1a2a6c;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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

const EditForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...updateData } = editingAdmin;
      // Only include password if it was changed
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateAdmin(_id, updateData);
      setAdmins(admins.map(admin => 
        admin._id === _id ? { ...admin, ...updateData } : admin
      ));
      setEditingAdmin(null);
      toast.success('Admin updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>
        <FaUserShield />
        Admin Management
      </Title>

      {editingAdmin ? (
        <EditForm onSubmit={handleUpdate}>
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
            <Label>New Password (leave blank to keep current)</Label>
            <Input
              type="password"
              value={editingAdmin.password}
              onChange={e => setEditingAdmin({...editingAdmin, password: e.target.value})}
              placeholder="Enter new password"
              minLength="3"
            />
          </FormGroup>

          <Button type="submit">Save Changes</Button>
          <Button type="button" secondary onClick={handleCancelEdit}>
            Cancel
          </Button>
        </EditForm>
      ) : (
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
      )}
    </Container>
  );
};

export default AdminList; 