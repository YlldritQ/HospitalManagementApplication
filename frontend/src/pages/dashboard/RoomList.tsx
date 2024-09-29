import React, { useEffect, useState } from "react";
import {
  getAllRooms,
  deleteRoom,
  updateRoom,
  createRoom,
} from "../../services/roomService"; // Adjust import path
import { RoomDto, CURoomDto } from "../../types/roomTypes"; // Adjust import path
import { toast, Toaster } from "react-hot-toast"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
import RoomEditModal from "../../components/modals/RoomEditModal"; // Import the RoomEditModal component
import { DepartmentDto } from "../../types/departmentTypes";
import { getDepartments } from "../../services/departmentService";
import useAuth from "../../hooks/useAuth.hook";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const { user: loggedInUser } = useAuth();
  const roles = loggedInUser?.roles;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
        const depData = await getDepartments();
        setDepartments(depData);
      } catch (err) {
        setError("Failed to fetch rooms");
        toast.error("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((room) => room.id !== id));
      toast.success("Room deleted successfully");
    } catch (err) {
      toast.error("Failed to delete room");
    }
  };

  const findDepartmentName = (departmentId: number) => {
    const department = departments.find((p) => p.id === departmentId);
    return department ? `${department.name}` : "Unknown department";
  };

  const openEditModal = (room: RoomDto) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleUpdate = async (roomDto: CURoomDto) => {
    if (selectedRoom) {
      try {
        await updateRoom(selectedRoom.id, roomDto);
        setRooms(
          rooms.map((room) =>
            room.id === selectedRoom.id ? { ...room, ...roomDto } : room
          )
        );
        toast.success("Room updated successfully");
        setModalOpen(false);
      } catch (err) {
        toast.error("Failed to update room");
      }
    }
  };

  const handleCreate = async (roomDto: CURoomDto) => {
    try {
      const newRoom = await createRoom(roomDto);
      setRooms([...rooms, newRoom]);
      toast.success("Room created successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Room List</h1>

      {roles?.includes("Admin") && (
        <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
          <div className="mb-6">
            <button
              onClick={() => {
                setSelectedRoom(null);
                setModalOpen(true);
              }}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Room
            </button>
          </div>

          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Room Number
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Occupied
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Department
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">{room.id}</td>
                  <td className="py-4 px-6 text-white">{room.roomNumber}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                        room.isOccupied ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {room.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {findDepartmentName(room.departmentId)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => openEditModal(room)}
                      className="text-blue-400 hover:underline mr-4 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-400 hover:underline transition duration-200"
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
      )}
      {(roles?.includes("Doctor") ||
        roles?.includes("Patient") ||
        roles?.includes("Nurse")) && (
        <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Room Number
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Occupied
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
                  Department
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">{room.id}</td>
                  <td className="py-4 px-6 text-white">{room.roomNumber}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                        room.isOccupied ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {room.isOccupied ? "Occupied" : "Available"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">
                    {findDepartmentName(room.departmentId)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomList;
