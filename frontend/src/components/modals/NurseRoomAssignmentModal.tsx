import React, { useEffect, useState } from 'react';
import { getUnassignedRoomsForNurses } from '../../services/roomService'; // Adjust import path
import { RoomDto } from '../../types/roomTypes';
import { toast } from 'react-hot-toast';
import { NurseRoomAssignmentDto } from '../../types/nurseTypes'; // Adjust import path
import { getRoomsAssignedToNurse } from '../../services/nurseService';

interface NurseRoomAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    nurseId: number;
    departmentId: number;
    onAssign: (dto: NurseRoomAssignmentDto) => void;
    onRemove: (dto: NurseRoomAssignmentDto) => void;
}

const NurseRoomAssignmentModal : React.FC<NurseRoomAssignmentModalProps> = ({ isOpen, onClose, nurseId, departmentId, onAssign, onRemove }) => {
    const [unassignedRooms, setUnassignedRooms] = useState<RoomDto[]>([]);
    const [assignedRooms, setAssignedRooms] = useState<RoomDto[]>([]);
    const [selectedAssignRoomIds, setSelectedAssignRoomIds] = useState<number[]>([]);
    const [selectedRemoveRoomIds, setSelectedRemoveRoomIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'assign' | 'remove'>('assign');

    useEffect(() => {
        if (isOpen) {
            const fetchRooms = async () => {
                setLoading(true);
                try {
                    const unassignedData = await getUnassignedRoomsForNurses(departmentId);
                    setUnassignedRooms(unassignedData);
                    const assignedData = await getRoomsAssignedToNurse(nurseId);
                    setAssignedRooms(assignedData);
                } catch (err) {
                    toast.error('Failed to fetch rooms');
                } finally {
                    setLoading(false);
                }
            };
            fetchRooms();
        }
    }, [isOpen, nurseId]);

    const handleRoomToggleAssign = (roomId: number) => {
        setSelectedAssignRoomIds(prevIds =>
            prevIds.includes(roomId) ? prevIds.filter(id => id !== roomId) : [...prevIds, roomId]
        );
    };

    const handleRoomToggleRemove = (roomId: number) => {
        setSelectedRemoveRoomIds(prevIds =>
            prevIds.includes(roomId) ? prevIds.filter(id => id !== roomId) : [...prevIds, roomId]
        );
    };

    const handleSubmit = () => {
        const dto: NurseRoomAssignmentDto = { nurseId, roomIds: mode === 'assign' ? selectedAssignRoomIds : selectedRemoveRoomIds };

        if (mode === 'assign') {
            onAssign(dto);
        } else if (mode === 'remove') {
            onRemove(dto);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Manage Rooms for Nurse
            </h2>
      
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setMode('assign')}
                className={`py-2 px-4 rounded ${
                  mode === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Assign Rooms
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`py-2 px-4 rounded ${
                  mode === 'remove' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                } transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                Remove Rooms
              </button>
            </div>
      
            {loading ? (
              <div className="text-center text-white">Loading...</div>
            ) : (
              <div>
                {mode === 'assign' && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Available Rooms to Assign</h3>
                    <ul>
                      {unassignedRooms.map((room) => (
                        <li key={room.id} className="flex items-center mb-2 text-white">
                          <input
                            type="checkbox"
                            id={`assign-room-${room.id}`}
                            checked={selectedAssignRoomIds.includes(room.id)}
                            onChange={() => handleRoomToggleAssign(room.id)}
                            className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                          />
                          <label htmlFor={`assign-room-${room.id}`}>{room.id}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
      
                {mode === 'remove' && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Assigned Rooms to Remove</h3>
                    <ul>
                      {assignedRooms.map((room) => (
                        <li key={room.id} className="flex items-center mb-2 text-white">
                          <input
                            type="checkbox"
                            id={`remove-room-${room.id}`}
                            checked={selectedRemoveRoomIds.includes(room.id)}
                            onChange={() => handleRoomToggleRemove(room.id)}
                            className="mr-2 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-600 rounded"
                          />
                          <label htmlFor={`remove-room-${room.id}`}>{room.id}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
      
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`py-2 px-4 rounded ${
                      mode === 'assign' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                    } text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      mode === 'assign' ? 'focus:ring-blue-500' : 'focus:ring-red-500'
                    }`}
                  >
                    {mode === 'assign' ? 'Assign' : 'Remove'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      
};

export default NurseRoomAssignmentModal;
