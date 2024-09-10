import React, { useEffect, useState } from 'react';
import { getAllRooms, deleteRoom, updateRoom, createRoom } from '../../services/roomService'; // Adjust import path
import { RoomDto, CURoomDto } from '../../types/roomTypes'; // Adjust import path
import { toast, Toaster } from 'react-hot-toast'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import RoomEditModal from '../../components/modals/RoomEditModal'; // Import the RoomEditModal component

const RoomList: React.FC = () => {
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms();
                setRooms(data);
            } catch (err) {
                setError('Failed to fetch rooms');
                toast.error('Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteRoom(id);
            setRooms(rooms.filter(room => room.id !== id));
            toast.success('Room deleted successfully');
        } catch (err) {
            toast.error('Failed to delete room');
        }
    };

    const openEditModal = (room: RoomDto) => {
        setSelectedRoom(room);
        setModalOpen(true);
    };

    const handleUpdate = async (roomDto: CURoomDto) => {
        if (selectedRoom) {
            try {
                await updateRoom(selectedRoom.id, roomDto);
                setRooms(rooms.map(room => (room.id === selectedRoom.id ? { ...room, ...roomDto } : room)));
                toast.success('Room updated successfully');
                setModalOpen(false);
            } catch (err) {
                toast.error('Failed to update room');
            }
        }
    };

    const handleCreate = async (roomDto: CURoomDto) => {
        try {
            const newRoom = await createRoom(roomDto);
            setRooms([...rooms, newRoom]);
            toast.success('Room created successfully');
            setModalOpen(false);
        } catch (err) {
            toast.error('Failed to create room');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Room List</h1>
            <div className="mb-4">
                <button
                    onClick={() => {
                        setSelectedRoom(null);
                        setModalOpen(true);
                    }}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add New Room
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-gray-200 text-left">
                        <th className="py-3 px-4 border-b">ID</th>
                        <th className="py-3 px-4 border-b">Room Number</th>
                        <th className="py-3 px-4 border-b">Occupied</th>
                        <th className="py-3 px-4 border-b">Department ID</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room.id} className="border-b">
                            <td className="py-3 px-4">{room.id}</td>
                            <td className="py-3 px-4">{room.roomNumber}</td>
                            <td className="py-3 px-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-white ${room.isOccupied ? 'bg-red-500' : 'bg-green-500'}`}>
                                    {room.isOccupied ? 'Occupied' : 'Available'}
                                </span>
                            </td>
                            <td className="py-3 px-4">{room.departmentId}</td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => openEditModal(room)}
                                    className="text-blue-500 hover:underline mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Toaster />
            {modalOpen && (
                <RoomEditModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    room={selectedRoom}
                    onUpdate={handleUpdate}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default RoomList;
