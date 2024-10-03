import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { getPlanets, deletePlanet } from "../../services/sistemiService";
import { PlanetDto } from "../../types/sistemiTypes";
import PlanetModal from "../../components/modals/PlanetModal";

const PlanetList: React.FC = () => {
  const [Planets, setPlanets] = useState<PlanetDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchPlanets = async () => {
          try {
              const data = await getPlanets();
              console.log(data);
              setPlanets(data);
            } catch (err) {
                setError("Failed to fetch Planets");
                toast.error("Failed to fetch Planets");
            } finally {
                setLoading(false);
            }
        };

    fetchPlanets();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePlanet(id);
      setPlanets(Planets.filter((Planet) => Planet.planetId !== id));
      toast.success("Planet deleted successfully");
    } catch (err) {
      toast.error("Failed to delete Planet");
    }
  };

  const handleButtonClick = (id: number) => {
    navigate(`/dashboard/edit-Planet/${id}`);
  };

  const handleAddPlanetClick = () => {
    setSelectedPlanet(null);
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Planet List</h1>
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={handleAddPlanetClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Planet
        </button>
      </div>
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
              ID
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
              Name
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
              Type
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
              isDeleted
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Planets.map((Planet) => (
            <tr
              key={Planet.planetId}
              className="hover:bg-gray-600 transition duration-200 border-b border-gray-600"
            >
              <td className="py-4 px-6 text-sm text-gray-300">
                {Planet.planetId}
              </td>
              <td className="py-4 px-6 text-sm text-gray-300">
                {Planet.name}
              </td>
              <td className="py-4 px-6 text-sm text-gray-300">
                {Planet.type}
              </td>
              <td className="py-4 px-6 text-sm text-gray-300">
                {Planet.isDeleted ? "Deleted" : "NOt Deleted"}
              </td>
              <td className="py-4 px-6 text-sm flex space-x-4">
                <button
                  onClick={() => handleButtonClick(Planet.planetId)}
                  className="text-blue-400 hover:text-blue-500 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(Planet.planetId)}
                  className="text-red-400 hover:text-red-500 transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toaster />
      <PlanetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        PlanetId={selectedPlanet ?? 0}
      />
    </div>
  );
};

export default PlanetList;
