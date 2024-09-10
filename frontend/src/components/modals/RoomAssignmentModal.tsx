import React, { useEffect, useState } from 'react';
import { getUnassignedRoomsForDoctors } from '../../services/roomService'; // Adjust the import path as needed
import { RoomDto } from '../../types/roomTypes';
import { toast } from 'react-hot-toast';
import { DoctorRoomManagementDto } from '../../types/doctorTypes'; // Adjust the import path as needed
import { getRoomsAssignedToDoctor } from '../../services/doctorService';

interface RoomAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId: number;
    onAssign: (dto: DoctorRoomManagementDto) => void;
    onRemove: (dto: DoctorRoomManagementDto) => void;
}

const RoomAssignmentModal: React.FC<RoomAssignmentModalProps> = ({ isOpen, onClose, doctorId, onAssign, onRemove }) => {
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
                    const unassignedData = await getUnassignedRoomsForDoctors();
                    setUnassignedRooms(unassignedData);
                    const assignedData = await getRoomsAssignedToDoctor(doctorId);
                    setAssignedRooms(assignedData);
                } catch (err) {
                    toast.error('Failed to fetch rooms');
                } finally {
                    setLoading(false);
                }
            };
            fetchRooms();
        }
    }, [isOpen, doctorId]);

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
        if (mode === 'assign') {
            onAssign({ doctorId, roomIds: selectedAssignRoomIds });
        } else if (mode === 'remove') {
            onRemove({ doctorId, roomIds: selectedRemoveRoomIds });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Manage Rooms for Doctor</h2>

                <div className="mb-4">
                    <button
                        onClick={() => setMode('assign')}
                        className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                    >
                        Assign Rooms
                    </button>
                    <button
                        onClick={() => setMode('remove')}
                        className={`py-2 px-4 rounded ${mode === 'remove' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                    >
                        Remove Rooms
                    </button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        {mode === 'assign' && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Available Rooms to Assign</h3>
                                <ul>
                                    {unassignedRooms.map(room => (
                                        <li key={room.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`assign-room-${room.id}`}
                                                checked={selectedAssignRoomIds.includes(room.id)}
                                                onChange={() => handleRoomToggleAssign(room.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`assign-room-${room.id}`}>{room.roomNumber}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {mode === 'remove' && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Assigned Rooms to Remove</h3>
                                <ul>
                                    {assignedRooms.map(room => (
                                        <li key={room.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`remove-room-${room.id}`}
                                                checked={selectedRemoveRoomIds.includes(room.id)}
                                                onChange={() => handleRoomToggleRemove(room.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`remove-room-${room.id}`}>{room.roomNumber}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}
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

export default RoomAssignmentModal;
