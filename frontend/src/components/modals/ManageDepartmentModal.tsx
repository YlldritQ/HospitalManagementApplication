import React, { useState } from 'react';
import AssignRemoveModal from './AssignRemoveModal'; // Ensure correct path

interface ManageDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentId: number;
    onActionSelect: (action: 'assign' | 'remove') => void;
    actionType: 'assign' | 'remove' | null;
}

const ManageDepartmentModal: React.FC<ManageDepartmentModalProps> = ({
    isOpen,
    onClose,
    departmentId,
    onActionSelect,
    actionType,
}) => {
    const [itemType, setItemType] = useState<'rooms' | 'doctors' | 'nurses' | null>(null); // State for item type

    const handleActionClick = (action: 'assign' | 'remove', itemType: 'rooms' | 'doctors' | 'nurses') => {
        onActionSelect(action);
        setItemType(itemType);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900 bg-opacity-50 p-4">
          <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Manage Department</h2>
      
            <div className="mb-8 flex flex-col items-center space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleActionClick('assign', 'rooms')}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Rooms
                </button>
                <button
                  onClick={() => handleActionClick('remove', 'rooms')}
                  className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove Rooms
                </button>
              </div>
      
              <div className="flex space-x-4">
                <button
                  onClick={() => handleActionClick('assign', 'doctors')}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Doctors
                </button>
                <button
                  onClick={() => handleActionClick('remove', 'doctors')}
                  className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove Doctors
                </button>
              </div>
      
              <div className="flex space-x-4">
                <button
                  onClick={() => handleActionClick('assign', 'nurses')}
                  className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Assign Nurses
                </button>
                <button
                  onClick={() => handleActionClick('remove', 'nurses')}
                  className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove Nurses
                </button>
              </div>
            </div>
      
            {actionType && itemType && (
              <AssignRemoveModal
                type={actionType}
                itemType={itemType}
                isOpen={true}
                onClose={() => {
                  onClose();
                  setItemType(null);
                }}
                departmentId={departmentId}
              />
            )}
      
            <div className="mt-6 flex justify-end">
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

export default ManageDepartmentModal;
