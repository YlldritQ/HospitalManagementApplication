import React, { useState } from 'react';
import { CreateDepartmentDto } from '../../types/departmentTypes';
import CustomModal from './Modal';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onCreateDepartment: (newDepartment: CreateDepartmentDto) => void;
}

const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({ isOpen, onRequestClose, onCreateDepartment }) => {
  const [newDepartment, setNewDepartment] = useState<CreateDepartmentDto>({ name: '', description: '' });

  const handleCreate = () => {
    onCreateDepartment(newDepartment);
    setNewDepartment({ name: '', description: '' });
  };

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create Department">
      <h2 className="text-xl font-semibold mb-4">Create New Department</h2>
      <input
        type="text"
        value={newDepartment.name}
        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
        placeholder="Department Name"
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="text"
        value={newDepartment.description}
        onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
        placeholder="Department Description"
        className="border p-2 rounded mb-2 w-full"
      />
      <button onClick={handleCreate} className="bg-blue-500 text-white p-2 rounded">
        Create Department
      </button>
    </CustomModal>
  );
};

export default CreateDepartmentModal;
