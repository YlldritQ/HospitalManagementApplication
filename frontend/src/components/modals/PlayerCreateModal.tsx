import React, { useState, useEffect } from 'react';
import { CUPlayerDto, TeamDto } from '../../types/testTypes';
import { getTeams } from '../../services/testServices';

interface PlayerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playerDto: CUPlayerDto) => Promise<void>;
}

const PlayerCreateModal: React.FC<PlayerCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [formData, setFormData] = useState<CUPlayerDto>({
    Name: '',
    Number: 0,
    BirthYear: 0,
    TeamId: 0,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamData = await getTeams();
        setTeams(teamData);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };

    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create player:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Player</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="Name" className="block text-sm font-medium text-gray-300">Player Name</label>
            <input
              id="Name"
              type="text"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              placeholder="Enter name"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Number" className="block text-sm font-medium text-gray-300">Player Number</label>
            <input
              id="Number"
              type="number"
              value={formData.Number}
              onChange={(e) => setFormData({ ...formData, Number: Number(e.target.value) })}
              placeholder="Enter number"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="BirthYear" className="block text-sm font-medium text-gray-300">Birth Year</label>
            <input
              id="BirthYear"
              type="number"
              value={formData.BirthYear}
              onChange={(e) => setFormData({ ...formData, BirthYear: Number(e.target.value) })}
              placeholder="Enter birth year"
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="TeamId" className="block text-sm font-medium text-gray-300">Team</label>
            <select
              id="TeamId"
              value={formData.TeamId}
              onChange={(e) => setFormData({ ...formData, TeamId: Number(e.target.value) })}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
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
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerCreateModal;
