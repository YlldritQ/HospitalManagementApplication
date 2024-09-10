import React, { useState } from 'react';
import { DepartmentDto } from '../../types/departmentTypes';
import { DoctorDto } from '../../types/doctorTypes';
import { NurseDto } from '../../types/nurseTypes';
import { RoomDto } from '../../types/roomTypes';
import CustomModal from './Modal';

interface AssignStaffRoomsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  department: DepartmentDto | null;
  doctors: DoctorDto[];
  nurses: NurseDto[];
  rooms: RoomDto[];
  onAssignDoctors: (departmentId: number, doctorIds: number[]) => void;
  onRemoveDoctors: (departmentId: number, doctorIds: number[]) => void;
  onAssignNurses: (departmentId: number, nurseIds: number[]) => void;
  onRemoveNurses: (departmentId: number, nurseIds: number[]) => void;
  onAssignRooms: (departmentId: number, roomIds: number[]) => void;
  onRemoveRooms: (departmentId: number, roomIds: number[]) => void;
}

const AssignStaffRoomsModal: React.FC<AssignStaffRoomsModalProps> = ({
  isOpen,
  onRequestClose,
  department,
  doctors,
  nurses,
  rooms,
  onAssignDoctors,
  onRemoveDoctors,
  onAssignNurses,
  onRemoveNurses,
  onAssignRooms,
  onRemoveRooms
}) => {
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<number[]>([]);
  const [selectedNurseIds, setSelectedNurseIds] = useState<number[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Assign/Remove Staff & Rooms">
      {department && (
        <>
          <h2 className="text-xl font-semibold mb-4">Assign/Remove Staff & Rooms</h2>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assign Doctors</h3>
            <select
              multiple
              onChange={(e) => setSelectedDoctorIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
              className="border p-2 rounded mr-2"
            >
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName}
                </option>
              ))}
            </select>
            <button
              onClick={() => onAssignDoctors(department.id, selectedDoctorIds)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Assign Doctors
            </button>
            <button
              onClick={() => onRemoveDoctors(department.id, selectedDoctorIds)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Remove Doctors
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assign Nurses</h3>
            <select
              multiple
              onChange={(e) => setSelectedNurseIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
              className="border p-2 rounded mr-2"
            >
              {nurses.map(nurse => (
                <option key={nurse.id} value={nurse.id}>
                  Nurse {nurse.firstName}
                </option>
              ))}
            </select>
            <button
              onClick={() => onAssignNurses(department.id, selectedNurseIds)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Assign Nurses
            </button>
            <button
              onClick={() => onRemoveNurses(department.id, selectedNurseIds)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Remove Nurses
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Assign Rooms</h3>
            <select
              multiple
              onChange={(e) => setSelectedRoomIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
              className="border p-2 rounded mr-2"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>
            <button
              onClick={() => onAssignRooms(department.id, selectedRoomIds)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Assign Rooms
            </button>
            <button
              onClick={() => onRemoveRooms(department.id, selectedRoomIds)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Remove Rooms
            </button>
          </div>
        </>
      )}
    </CustomModal>
  );
};

export default AssignStaffRoomsModal;
