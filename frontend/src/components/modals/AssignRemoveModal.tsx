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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">
          {type === 'assign' ? 'Assign' : 'Remove'} {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {items.map((item) => (
              <div key={(item as any).id} className="flex items-center mb-2">
                <input
                  id={`item-${(item as any).id}`}
                  type="checkbox"
                  checked={selectedItems.includes((item as any).id)}
                  onChange={() => handleItemSelection((item as any).id)}
                  className="mr-2"
                />
                <label htmlFor={`item-${(item as any).id}`} className="cursor-pointer">
                  {itemType.charAt(0).toUpperCase() + itemType.slice(1)} {(item as any).id}
                </label>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleAction}
          className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
        >
          {type === 'assign' ? 'Assign' : 'Remove'}
        </button>
        <button
          onClick={onClose}
          className="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-4 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AssignRemoveModal;
