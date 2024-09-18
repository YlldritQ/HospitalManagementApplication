import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { RoomDto, CURoomDto } from '../../types/roomTypes';
import { DepartmentDto } from '../../types/departmentTypes'; // Import the department type
import { getDepartments } from '../../services/departmentService'; // Import the getDepartments function

interface RoomEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDto | null;
  onUpdate: (roomDto: CURoomDto) => void;
  onCreate: (roomDto: CURoomDto) => void;
}

const RoomEditModal: React.FC<RoomEditModalProps> = ({ isOpen, onClose, room, onUpdate, onCreate }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [isOccupied, setIsOccupied] = useState(false);
  const [departmentId, setDepartmentId] = useState<number | ''>('');
  const [departments, setDepartments] = useState<DepartmentDto[]>([]); // State for departments

  useEffect(() => {
    if (room) {
      setRoomNumber(room.roomNumber);
      setIsOccupied(room.isOccupied);
      setDepartmentId(room.departmentId);
    } else {
      setRoomNumber('');
      setIsOccupied(false);
      setDepartmentId('');
    }
  }, [room]);

  useEffect(() => {
    // Fetch all departments on component mount
    const fetchDepartments = async () => {
      const departmentData = await getDepartments();
      setDepartments(departmentData);
    };

    fetchDepartments();
  }, []);

  const handleSave = () => {
    const roomDto: CURoomDto = { roomNumber, isOccupied, departmentId: Number(departmentId) };
    if (room) {
      onUpdate(roomDto);
    } else {
      onCreate(roomDto);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white w-full max-w-lg mx-auto p-6 rounded-md shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">{room ? 'Edit Room' : 'Create Room'}</h2>
      <div>
        <div className="mb-4">
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            id="roomNumber"
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="Enter room number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="isOccupied" className="block text-sm font-medium text-gray-700">Is Occupied</label>
          <input
            id="isOccupied"
            type="checkbox"
            checked={isOccupied}
            onChange={(e) => setIsOccupied(e.target.checked)}
            className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <select
            id="department"
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            {room ? 'Update Room' : 'Create Room'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomEditModal;
