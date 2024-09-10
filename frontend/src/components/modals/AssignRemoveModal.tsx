import React, { useState, useEffect } from 'react';
import {
  addDoctorsToDepartment,
  removeDoctorsFromDepartment,
  addNursesToDepartment,
  removeNursesFromDepartment,
  addRoomsToDepartment,
  removeRoomsFromDepartment,
} from '../../services/departmentService'; // Ensure correct paths for all service functions

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
  const [items, setItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      // Fetch existing items (rooms, doctors, or nurses) if necessary
      // Replace with actual item data fetching logic
      setItems([]); // Replace with actual data fetching based on itemType
    };

    fetchItems();
  }, [departmentId, itemType]);

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
        <div>
          {/* Render list of items (rooms, doctors, or nurses) */}
          {items.map((itemId) => (
            <div key={itemId} className="flex items-center mb-2">
              <input
                id={`item-${itemId}`}
                type="checkbox"
                checked={selectedItems.includes(itemId)}
                onChange={() => handleItemSelection(itemId)}
                className="mr-2"
              />
              <label htmlFor={`item-${itemId}`} className="cursor-pointer">
                {itemType.charAt(0).toUpperCase() + itemType.slice(1)} {itemId}
              </label>
            </div>
          ))}
        </div>
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
