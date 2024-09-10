import React, { useEffect, useState } from 'react';
import { getAllNurses } from '../../services/nurseService';
import { NurseDto } from '../../types/nurseTypes';
import { toast } from 'react-hot-toast';

interface NurseAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentId: number;
    onAssign: (nurseIds: number[]) => void;
    onRemove: (nurseIds: number[]) => void;
}

const NurseAssignmentModal: React.FC<NurseAssignmentModalProps> = ({ isOpen, onClose, onAssign, onRemove }) => {
    const [nurses, setNurses] = useState<NurseDto[]>([]);
    const [selectedAssignNurseIds, setSelectedAssignNurseIds] = useState<number[]>([]);
    const [selectedRemoveNurseIds, setSelectedRemoveNurseIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'assign' | 'remove'>('assign');

    useEffect(() => {
        if (isOpen) {
            const fetchNurses = async () => {
                setLoading(true);
                try {
                    const data = await getAllNurses();
                    setNurses(data);
                } catch (err) {
                    toast.error('Failed to fetch nurses');
                } finally {
                    setLoading(false);
                }
            };
            fetchNurses();
        }
    }, [isOpen]);

    const handleNurseToggleAssign = (nurseId: number) => {
        setSelectedAssignNurseIds(prevIds =>
            prevIds.includes(nurseId) ? prevIds.filter(id => id !== nurseId) : [...prevIds, nurseId]
        );
    };

    const handleNurseToggleRemove = (nurseId: number) => {
        setSelectedRemoveNurseIds(prevIds =>
            prevIds.includes(nurseId) ? prevIds.filter(id => id !== nurseId) : [...prevIds, nurseId]
        );
    };

    const handleSubmit = async () => {
        if (mode === 'assign') {
            await onAssign(selectedAssignNurseIds);
            toast.success('Nurses assigned successfully');
        } else if (mode === 'remove') {
            await onRemove(selectedRemoveNurseIds);
            toast.success('Nurses removed successfully');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Manage Nurses for Department</h2>

                <div className="mb-4">
                    <button
                        onClick={() => setMode('assign')}
                        className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                    >
                        Assign Nurses
                    </button>
                    <button
                        onClick={() => setMode('remove')}
                        className={`py-2 px-4 rounded ${mode === 'remove' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                    >
                        Remove Nurses
                    </button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        {mode === 'assign' && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Available Nurses to Assign</h3>
                                <ul>
                                    {nurses.map(nurse => (
                                        <li key={nurse.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`assign-nurse-${nurse.id}`}
                                                checked={selectedAssignNurseIds.includes(nurse.id)}
                                                onChange={() => handleNurseToggleAssign(nurse.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`assign-nurse-${nurse.id}`}>{`${nurse.firstName} ${nurse.lastName}`}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {mode === 'remove' && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Assigned Nurses to Remove</h3>
                                <ul>
                                    {nurses.filter(nurse => selectedRemoveNurseIds.includes(nurse.id)).map(nurse => (
                                        <li key={nurse.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`remove-nurse-${nurse.id}`}
                                                checked={selectedRemoveNurseIds.includes(nurse.id)}
                                                onChange={() => handleNurseToggleRemove(nurse.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`remove-nurse-${nurse.id}`}>{`${nurse.firstName} ${nurse.lastName}`}</label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`py-2 px-4 rounded ${mode === 'assign' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}
                            >
                                {mode === 'assign' ? 'Assign' : 'Remove'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NurseAssignmentModal;
