import React, { useState, useEffect } from 'react';
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

const RoomEditModal: React.FC<RoomEditModalProps> = ({ onClose, room, onUpdate, onCreate }) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
        <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{room ? 'Edit Room' : 'Create Room'}</h2>
            
            <div>
                <div className="mb-4">
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-300">Room Number</label>
                    <input
                        id="roomNumber"
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Enter room number"
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="isOccupied" className="block text-sm font-medium text-gray-300">Is Occupied</label>
                    <input
                        id="isOccupied"
                        type="checkbox"
                        checked={isOccupied}
                        onChange={(e) => setIsOccupied(e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-300">Department</label>
                    <select
                        id="department"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(Number(e.target.value))}
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {room ? 'Update Room' : 'Create Room'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

};

export default RoomEditModal;
