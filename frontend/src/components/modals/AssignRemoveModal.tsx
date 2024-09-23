import React, { useState, useEffect } from 'react';
import {
  addDoctorsToDepartment,
  removeDoctorsFromDepartment,
  addNursesToDepartment,
  removeNursesFromDepartment,
  addRoomsToDepartment,
  removeRoomsFromDepartment
} from '../../services/departmentService'; // Ensure correct paths for all service functions
import { getDoctorsNoDepartmentId, getDoctorsByDepartmentId } from '../../services/doctorService';
import { getNurseNoDepartmentId, getNurseByepartmentId } from '../../services/nurseService';
import { getRoomNoDepartmentId, getRoomByDepartmentId } from '../../services/roomService';
import { DoctorDto } from '../../types/doctorTypes';
import { NurseDto } from '../../types/nurseTypes';
import { RoomDto } from '../../types/roomTypes';

// Import DTOs

interface AssignRemoveModalProps {
  type: 'assign' | 'remove';
  itemType: 'rooms' | 'doctors' | 'nurses';
  isOpen: boolean;
  onClose: () => void;
  departmentId: number;
}

const AssignRemoveModal: React.FC<AssignRemoveModalProps> = ({
  type,
  itemType,
  isOpen,
  onClose,
  departmentId,
}) => {
  const [items, setItems] = useState<(DoctorDto | NurseDto | RoomDto)[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        let fetchedItems: (DoctorDto | NurseDto | RoomDto)[] = [];
        switch (itemType) {
          case 'rooms':
            fetchedItems = type === 'assign'
              ? await getRoomNoDepartmentId() || []
              : await getRoomByDepartmentId(departmentId) || [];
            break;
          case 'doctors':
            fetchedItems = type === 'assign'
              ? await getDoctorsNoDepartmentId() || []
              : await getDoctorsByDepartmentId(departmentId) || [];
            break;
          case 'nurses':
            fetchedItems = type === 'assign'
              ? await getNurseNoDepartmentId() || []
              : await getNurseByepartmentId(departmentId) || [];
            break;
        }
        setItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [departmentId, itemType, type]);
  
  const handleItemSelection = (itemId: number) => {
    setSelectedItems((prevState) =>
      prevState.includes(itemId)
        ? prevState.filter((id) => id !== itemId)
        : [...prevState, itemId]
      );
    };
    console.log(departmentId);
  
  const handleAction = async () => {
    try {
      if (itemType === 'rooms') {
        if (type === 'assign') {
          await addRoomsToDepartment(departmentId, selectedItems);
        } else if (type === 'remove') {
          await removeRoomsFromDepartment(departmentId, selectedItems);
        }
      } else if (itemType === 'doctors') {
        if (type === 'assign') {
          await addDoctorsToDepartment(departmentId, selectedItems);
        } else if (type === 'remove') {
          await removeDoctorsFromDepartment(departmentId, selectedItems);
        }
      } else if (itemType === 'nurses') {
        if (type === 'assign') {
          await addNursesToDepartment(departmentId, selectedItems);
        } else if (type === 'remove') {
          await removeNursesFromDepartment(departmentId, selectedItems);
        }
      }
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Failed to update items:', error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900 bg-opacity-75 p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          {type === 'assign' ? 'Assign' : 'Remove'} {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </h3>
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={(item as any).id} className="flex items-center">
                <input
                  id={`item-${(item as any).id}`}
                  type="checkbox"
                  checked={selectedItems.includes((item as any).id)}
                  onChange={() => handleItemSelection((item as any).id)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <label
                  htmlFor={`item-${(item as any).id}`}
                  className="text-gray-300 cursor-pointer"
                >
                  {itemType.charAt(0).toUpperCase() + itemType.slice(1)} {(item as any).id}
                </label>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleAction}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {type === 'assign' ? 'Assign' : 'Remove'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default AssignRemoveModal;
