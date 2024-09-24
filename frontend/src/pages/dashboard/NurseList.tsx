import React, { useEffect, useState } from "react";
import {
  getAllNurses,
  deleteNurse,
  assignRoomsToNurse,
  removeRoomsFromNurse,
} from "../../services/nurseService"; // Adjust import path
import { NurseDto } from "../../types/nurseTypes";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { getDepartmentById } from "../../services/departmentService";
import  NurseRoomAssignmentModal  from "../../components/modals/NurseRoomAssignmentModal"; // Adjust import path
import { NurseRoomAssignmentDto } from "../../types/nurseTypes"; // Adjust import path

const NurseList: React.FC = () => {
  const [nurses, setNurses] = useState<NurseDto[]>([]);
  const [departments, setDepartments] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNurseId, setSelectedNurseId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const data = await getAllNurses();
        setNurses(data);
        const departmentIds = Array.from(
          new Set(
            data.map((nurse) => nurse.departmentId).filter((id) => id > 0)
          )
        );
        const departmentPromises = departmentIds.map((id) =>
          getDepartmentById(id)
        );
        const departmentData = await Promise.all(departmentPromises);
        const departmentMap: Record<number, string> = {};
        departmentData.forEach((department) => {
          if (department) {
            departmentMap[department.id] = department.name;
          }
        });
        setDepartments(departmentMap);
      } catch (err) {
        setError("Failed to fetch nurses");
        toast.error("Failed to fetch nurses");
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteNurse(id);
      setNurses(nurses.filter((nurse) => nurse.id !== id));
      toast.success("Nurse deleted successfully");
    } catch (err) {
      toast.error("Failed to delete nurse");
    }
  };

  const handleButtonClick = (id: number) => {
    navigate(`/dashboard/edit-nurse/${id}`);
  };

  const openRoomAssignmentModal = (nurseId: number, departmentId: number) => {
    setSelectedNurseId(nurseId);
    setSelectedDepartmentId(departmentId);
    setModalOpen(true);
  };

  const handleAssign = async (dto: NurseRoomAssignmentDto) => {
    try {
      await assignRoomsToNurse(dto.nurseId, dto);
      toast.success("Rooms assigned successfully");
      setModalOpen(false);
      // Update the list of nurses or perform other actions if necessary
    } catch (err) {
      toast.error("Failed to assign rooms");
    }
  };

  const handleRemove = async (dto: NurseRoomAssignmentDto) => {
    try {
      await removeRoomsFromNurse(dto.nurseId, dto);
      toast.success("Rooms removed successfully");
      setModalOpen(false);
      // Update the list of nurses or perform other actions if necessary
    } catch (err) {
      toast.error("Failed to remove rooms");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

 return (
  <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
    <h1 className="text-3xl font-bold text-white mb-8">Nurse List</h1>
    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      <thead>
        <tr className="bg-gray-900 text-white">
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Contact Info</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Department</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Available</th>
          <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {nurses.map((nurse) => (
          <tr key={nurse.id} className="border-b border-gray-700">
            <td className="py-4 px-6 text-white">{nurse.id}</td>
            <td className="py-4 px-6 text-white">{`${nurse.firstName} ${nurse.lastName}`}</td>
            <td className="py-4 px-6 text-white">{nurse.contactInfo}</td>
            <td className="py-4 px-6 text-white">
              {nurse.departmentId > 0 ? departments[nurse.departmentId] : "N/A"}
            </td>
            <td className="py-4 px-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-white font-semibold ${
                  nurse.isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {nurse.isAvailable ? "Available" : "Not Available"}
              </span>
            </td>
            <td className="py-4 px-6">
              <button
                onClick={() => handleButtonClick(nurse.id)}
                className="text-blue-400 hover:underline mr-4 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(nurse.id)}
                className="text-red-400 hover:underline mr-4 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => openRoomAssignmentModal(nurse.id, nurse.departmentId)}
                className="text-green-400 hover:underline transition duration-200"
              >
                Manage Rooms
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <Toaster />
    {selectedNurseId !== null && selectedDepartmentId !== null && (
      <NurseRoomAssignmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        nurseId={selectedNurseId ?? 0}
        departmentId={selectedDepartmentId ?? 0}
        onAssign={handleAssign}
        onRemove={handleRemove}
      />
    )}
  </div>
);

};

export default NurseList;
