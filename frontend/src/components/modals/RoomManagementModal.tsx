import React, { useEffect, useState } from 'react';
import { getAllRooms } from '../../services/roomService';
import { RoomDto } from '../../types/roomTypes';
import { toast } from 'react-hot-toast';

interface RoomManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentId: number;
    onAssign: (roomIds: number[]) => void;
    onRemove: (roomIds: number[]) => void;
}

const RoomManagementModal: React.FC<RoomManagementModalProps> = ({ isOpen, onClose, onAssign, onRemove }) => {
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [selectedAssignRoomIds, setSelectedAssignRoomIds] = useState<number[]>([]);
    const [selectedRemoveRoomIds, setSelectedRemoveRoomIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'assign' | 'remove'>('assign');

    useEffect(() => {
        if (isOpen) {
            const fetchRooms = async () => {
                setLoading(true);
                try {
                    const data = await getAllRooms();
                    setRooms(data);
                } catch (err) {
                    toast.error('Failed to fetch rooms');
                } finally {
                    setLoading(false);
                }
            };
            fetchRooms();
        }
    }, [isOpen]);

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

    const handleSubmit = async () => {
        if (mode === 'assign') {
            await onAssign(selectedAssignRoomIds);
            toast.success('Rooms assigned successfully');
        } else if (mode === 'remove') {
            await onRemove(selectedRemoveRoomIds);
            toast.success('Rooms removed successfully');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r backdrop-blur-sm from-gray-900 via-gray-800 to-gray-900 bg-opacity-50 p-4">
            <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Manage Rooms for Department</h2>
    
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setMode('assign')}
                        className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                        Assign Rooms
                    </button>
                    <button
                        onClick={() => setMode('remove')}
                        className={`py-2 px-4 rounded ${mode === 'remove' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
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
                                    {rooms.map(room => (
                                        <li key={room.id} className="flex items-center mb-2 text-white">
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
                                <h3 className="text-lg font-semibold text-white">Assigned Rooms to Remove</h3>
                                <ul>
                                    {rooms.filter(room => selectedRemoveRoomIds.includes(room.id)).map(room => (
                                        <li key={room.id} className="flex items-center mb-2 text-white">
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
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'} transition duration-200`}
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

export default RoomManagementModal;
