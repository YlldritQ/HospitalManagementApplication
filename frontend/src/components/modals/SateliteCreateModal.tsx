import React, { useState, useEffect } from 'react';
import { CUSateliteDto, PlanetDto } from '../../types/sistemiTypes';
import { getPlanets } from '../../services/sistemiService';

interface SateliteCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CUSateliteDto) => void;
    id?: number; // Add id as an optional property
  }
  

const SateliteCreateModal: React.FC<SateliteCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [planets, setPlanets] = useState<PlanetDto[]>([]);
  const [formData, setFormData] = useState<CUSateliteDto>({
    name: '',
    isDeleted: false,
    planetId: 0,
  });

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const planetData = await getPlanets();
        setPlanets(planetData);
      } catch (error) {
        console.error('Failed to fetch planets:', error);
      }
    };

    if (isOpen) {
      fetchPlanets();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create satelite:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Satelite</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="Name" className="block text-sm font-medium text-gray-300">Satellite Name</label>
              <input
                id="Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
        
            <div className="mb-4">
              <label htmlFor="PlanetId" className="block text-sm font-medium text-gray-300">Planet</label>
              <select
                id="PlanetId"
                value={formData.planetId}
                onChange={(e) => setFormData({ ...formData, planetId: Number(e.target.value) })}
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Planet</option>
                {planets.map((planet) => (
                  <option key={planet.planetId} value={planet.planetId}>
                    {planet.name}
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

export default SateliteCreateModal;
