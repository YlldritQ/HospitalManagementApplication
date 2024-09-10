import React, { useState, useEffect } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addDoctorsToDepartment,
  removeDoctorsFromDepartment,
  addNursesToDepartment,
  removeNursesFromDepartment,
  addRoomsToDepartment,
  removeRoomsFromDepartment
} from '../../services/departmentService';
import { getDoctors } from '../../services/doctorService';
import { getAllNurses } from '../../services/nurseService';
import { getAllRooms } from '../../services/roomService';
import { DepartmentDto, CreateDepartmentDto } from '../../types/departmentTypes';
import { DoctorDto } from '../../types/doctorTypes';
import { NurseDto } from '../../types/nurseTypes';
import { RoomDto, CURoomDto } from '../../types/roomTypes';
import CreateDepartmentModal from '../../components/modals/CreateDepartmentModal';
import EditDepartmentModal from '../../components/modals/EditDepartmentModal';
import AssignStaffRoomsModal from '../../components/modals/AssignStaffRoomsModal';
import RoomEditModal from '../../components/modals/RoomEditModal'; // Import RoomEditModal

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [nurses, setNurses] = useState<NurseDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRoomEditModalOpen, setIsRoomEditModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<DepartmentDto | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomDto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsData, doctorsData, nursesData, roomsData] = await Promise.all([
          getDepartments(),
          getDoctors(),
          getAllNurses(),
          getAllRooms()
        ]);

        setDepartments(departmentsData);
        setDoctors(doctorsData);
        setNurses(nursesData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateDepartment = async (newDepartment: CreateDepartmentDto) => {
    try {
      const department = await createDepartment(newDepartment);
      setDepartments([...departments, department]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleUpdateDepartment = async (id: number, updatedDepartment: DepartmentDto) => {
    try {
      const response = await updateDepartment(id, updatedDepartment);
      if (response.isSucceed) {
        setDepartments(departments.map(department =>
          department.id === id ? { ...department, ...updatedDepartment } : department
        ));
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartment(id);
      setDepartments(departments.filter(department => department.id !== id));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleAssignDoctors = async (departmentId: number, doctorIds: number[]) => {
    try {
      await addDoctorsToDepartment(departmentId, doctorIds);
      setIsAssignModalOpen(false);
    } catch (error) {
      console.error('Error assigning doctors:', error);
    }
  };

  const handleRemoveDoctors = async (departmentId: number, doctorIds: number[]) => {
    try {
      await removeDoctorsFromDepartment(departmentId, doctorIds);
    } catch (error) {
      console.error('Error removing doctors:', error);
    }
  };

  const handleAssignNurses = async (departmentId: number, nurseIds: number[]) => {
    try {
      await addNursesToDepartment(departmentId, nurseIds);
      setIsAssignModalOpen(false);
    } catch (error) {
      console.error('Error assigning nurses:', error);
    }
  };

  const handleRemoveNurses = async (departmentId: number, nurseIds: number[]) => {
    try {
      await removeNursesFromDepartment(departmentId, nurseIds);
    } catch (error) {
      console.error('Error removing nurses:', error);
    }
  };

  const handleAssignRooms = async (departmentId: number, roomIds: number[]) => {
    try {
      await addRoomsToDepartment(departmentId, roomIds);
      setIsAssignModalOpen(false);
    } catch (error) {
      console.error('Error assigning rooms:', error);
    }
  };

  const handleRemoveRooms = async (departmentId: number, roomIds: number[]) => {
    try {
      await removeRoomsFromDepartment(departmentId, roomIds);
    } catch (error) {
      console.error('Error removing rooms:', error);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (department: DepartmentDto) => {
    setCurrentDepartment(department);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openAssignModal = (department: DepartmentDto) => {
    setCurrentDepartment(department);
    setIsAssignModalOpen(true);
  };
  const closeAssignModal = () => setIsAssignModalOpen(false);

  const openRoomEditModal = (room: RoomDto | null) => {
    setCurrentRoom(room);
    setIsRoomEditModalOpen(true);
  };
  const closeRoomEditModal = () => setIsRoomEditModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Department List</h1>
      <button onClick={openCreateModal} className="bg-blue-500 text-white p-2 rounded">
        Create New Department
      </button>

      <div>
        {departments.map(department => (
          <div key={department.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold">{department.name}</h2>
            <p>{department.description}</p>
            <button
              onClick={() => openEditModal(department)}
              className="bg-yellow-500 text-white p-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteDepartment(department.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => openAssignModal(department)}
              className="bg-green-500 text-white p-2 rounded ml-2"
            >
              Assign/Remove Staff & Rooms
            </button>
            {/* Add button to open Room Edit Modal */}
            <button
              onClick={() => openRoomEditModal(null)}
              className="bg-blue-500 text-white p-2 rounded ml-2"
            >
              Manage Rooms
            </button>
          </div>
        ))}
      </div>

      <CreateDepartmentModal
        isOpen={isCreateModalOpen}
        onRequestClose={closeCreateModal}
        onCreateDepartment={handleCreateDepartment}
      />

      <EditDepartmentModal
        isOpen={isEditModalOpen && currentDepartment !== null}
        onRequestClose={closeEditModal}
        department={currentDepartment}
        onUpdateDepartment={handleUpdateDepartment}
      />

      <AssignStaffRoomsModal
        isOpen={isAssignModalOpen && currentDepartment !== null}
        onRequestClose={closeAssignModal}
        department={currentDepartment}
        doctors={doctors}
        nurses={nurses}
        rooms={rooms}
        onAssignDoctors={handleAssignDoctors}
        onRemoveDoctors={handleRemoveDoctors}
        onAssignNurses={handleAssignNurses}
        onRemoveNurses={handleRemoveNurses}
        onAssignRooms={handleAssignRooms}
        onRemoveRooms={handleRemoveRooms}
      />

      <RoomEditModal
        isOpen={isRoomEditModalOpen}
        onClose={closeRoomEditModal}
        room={currentRoom}
        onUpdate={async (roomDto: CURoomDto) => {
          // Implement your update logic here
        }}
        onCreate={async (roomDto: CURoomDto) => {
          // Implement your create logic here
        }}
      />
    </div>
  );
};

export default DepartmentList;
