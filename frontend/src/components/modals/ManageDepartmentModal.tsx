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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Manage Department</h2>

                <div className="mb-4 flex flex-col items-center">
                    <div className="mb-2">
                        <button
                            onClick={() => handleActionClick('assign', 'rooms')}
                            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                        >
                            Assign Rooms
                        </button>
                        <button
                            onClick={() => handleActionClick('remove', 'rooms')}
                            className="inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Remove Rooms
                        </button>
                    </div>
                    <div className="mb-2">
                        <button
                            onClick={() => handleActionClick('assign', 'doctors')}
                            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                        >
                            Assign Doctors
                        </button>
                        <button
                            onClick={() => handleActionClick('remove', 'doctors')}
                            className="inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Remove Doctors
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => handleActionClick('assign', 'nurses')}
                            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                        >
                            Assign Nurses
                        </button>
                        <button
                            onClick={() => handleActionClick('remove', 'nurses')}
                            className="inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Remove Nurses
                        </button>
                    </div>
                </div>

                {actionType && itemType && (
                    <AssignRemoveModal
                        type={actionType}
                        itemType={itemType} // Pass the selected item type
                        isOpen={true}
                        onClose={() => {
                            onClose();
                            setItemType(null); // Reset item type when modal is closed
                        }}
                        departmentId={departmentId}
                    />
                )}

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageDepartmentModal;
