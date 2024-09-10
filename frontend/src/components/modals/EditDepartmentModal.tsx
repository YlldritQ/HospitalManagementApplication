import React, { useState } from 'react';
import { DepartmentDto } from '../../types/departmentTypes';
import CustomModal from './Modal';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  department: DepartmentDto | null;
  onUpdateDepartment: (id: number, updatedDepartment: DepartmentDto) => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onRequestClose, department, onUpdateDepartment }) => {
  const [updatedDepartment, setUpdatedDepartment] = useState<DepartmentDto>(department || { id: 0, name: '', description: '' });

  const handleUpdate = () => {
    if (department) {
      onUpdateDepartment(department.id, updatedDepartment);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Department">
      {department && (
        <>
          <h2 className="text-xl font-semibold mb-4">Edit Department</h2>
          <input
            type="text"
            value={updatedDepartment.name}
            onChange={(e) => setUpdatedDepartment({ ...updatedDepartment, name: e.target.value })}
            placeholder="Department Name"
            className="border p-2 rounded mb-2 w-full"
          />
          <input
            type="text"
            value={updatedDepartment.description}
            onChange={(e) => setUpdatedDepartment({ ...updatedDepartment, description: e.target.value })}
            placeholder="Department Description"
            className="border p-2 rounded mb-2 w-full"
          />
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
        </>
      )}
    </CustomModal>
  );
};

export default EditDepartmentModal;
