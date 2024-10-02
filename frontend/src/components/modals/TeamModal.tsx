import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getTeamByID, createTeam, updateTeam } from '../../services/testServices';
import { TeamDto } from '../../types/testTypes';

interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    TeamId: number;
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, TeamId }) => {
    const [Team, setTeam] = useState<TeamDto | null>(null);
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    useEffect(() => {
        if (TeamId > 0) {
            setMode('edit');
            const fetchTeam = async () => {
                setLoading(true);
                try {
                    const data = await getTeamByID(TeamId);
                    if (data) {
                        setTeam(data);
                        setName(data.name);
                    }
                } catch (err) {
                    toast.error('Failed to fetch Team');
                } finally {
                    setLoading(false);
                }
            };
            fetchTeam();
        } else {
            setMode('create');
            setName('');
        }
    }, [TeamId, isOpen]);

    const handleSubmit = async () => {
        try {
            if (mode === 'create') {
                await createTeam({ name });
                toast.success('Team created successfully');
            } else {
                if (Team) {
                    await updateTeam(TeamId, { ...Team, name });
                    toast.success('Team updated successfully');
                }
            }
            onClose();
        } catch (err) {
            toast.error('Failed to save Team');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="mt-10 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              {mode === 'create' ? 'Add Team' : 'Edit Team'}
            </h2>
      
            {loading ? (
              <div className="text-center text-gray-300">Loading...</div>
            ) : (
              <div>
                <div className="mb-6">
                  <label htmlFor="Team-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    id="Team-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Team name"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>      
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`py-3 px-4 font-semibold rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      mode === 'create'
                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
                    }`}
                  >
                    {mode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      
};

export default TeamModal;
