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
import NurseRoomAssignmentModal from "./NurseRoomAssignmentModal"; // Adjust import path
import { NurseRoomAssignmentDto } from "../../types/nurseTypes"; // Adjust import path

const NurseList: React.FC = () => {
  const [nurses, setNurses] = useState<NurseDto[]>([]);
  const [departments, setDepartments] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNurseId, setSelectedNurseId] = useState<number | null>(null);
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

  const openRoomAssignmentModal = (nurseId: number) => {
    setSelectedNurseId(nurseId);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nurse List</h1>
      <div className="mb-4">
        <button
          onClick={() => navigate("/dashboard/edit-nurse/:id")}
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add New Nurse
        </button>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="w-full bg-gray-200 text-left">
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Contact Info</th>
            <th className="py-3 px-4 border-b">Department</th>
            <th className="py-3 px-4 border-b">Available</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {nurses.map((nurse) => (
            <tr key={nurse.id} className="border-b">
              <td className="py-3 px-4">{nurse.id}</td>
              <td className="py-3 px-4">{`${nurse.firstName} ${nurse.lastName}`}</td>
              <td className="py-3 px-4">{nurse.contactInfo}</td>
              <td className="py-3 px-4">
                {nurse.departmentId > 0
                  ? departments[nurse.departmentId]
                  : "N/A"}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white ${
                    nurse.isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {nurse.isAvailable ? "Available" : "Not Available"}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleButtonClick(nurse.id)}
                  className="text-blue-500 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(nurse.id)}
                  className="text-red-500 hover:underline mr-3"
                >
                  Delete
                </button>
                <button
                  onClick={() => openRoomAssignmentModal(nurse.id)}
                  className="text-green-500 hover:underline mr-3"
                >
                  Manage Rooms
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toaster />
      {selectedNurseId !== null && (
        <NurseRoomAssignmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          nurseId={selectedNurseId}
          onAssign={handleAssign}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default NurseList;
