import React, { useState, useEffect } from 'react';
import { CUPlayerDto, TeamDto } from '../../types/testTypes';
import { getTeams } from '../../services/testServices';

interface PlayerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (roomDt: CUPlayerDto) => void;
}

const PlayerCreateModal: React.FC<PlayerCreateModalProps> = ({ onClose, onCreate }) => {
  const [teams, setTeams] = useState<TeamDto[]>([]); // State for departments
  const [Name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [BirthYear, setBirthYear] = useState('');
  const [TeamId, setTeamId] = useState<number | ''>('');

  useEffect(() => {
   
      setName('');
      setNumber('');
      setBirthYear('');
      setTeamId('');
    
  }, []);

  useEffect(() => {
    // Fetch all departments on component mount
    const fetchTeams = async () => {
      const departmentData = await getTeams();
      setTeams(departmentData);
    };

    fetchTeams();
  }, []);

  const handleSave = () => {
    const playerDto: CUPlayerDto = { Name, number: Number(number), BirthYear:Number(BirthYear), TeamId: Number(TeamId) };
      onCreate(playerDto);
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
        <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{Name ? 'Edit Room' : 'Create Room'}</h2>
            
            <div>
                <div className="mb-4">
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-300">Room Name</label>
                    <input
                        id="Name"
                        type="text"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-300">Room Number</label>
                    <input
                        id="Number"
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter number"
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-300">Birth Year</label>
                    <input
                        id="BirthYear"
                        type="text"
                        value={BirthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="Enter name"
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="Teams" className="block text-sm font-medium text-gray-300">Team</label>
                    <select
                        id="team"
                        value={TeamId}
                        onChange={(e) => setTeamId(Number(e.target.value))}
                        className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a Team</option>
                        {teams.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
);

};

export default PlayerCreateModal;
