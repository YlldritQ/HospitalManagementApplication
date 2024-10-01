import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { getTeams, deleteTeam } from "../../services/testServices";
import { TeamDto } from "../../types/testTypes";
import TeamModal from "../../components/modals/TeamModal";

const TeamList: React.FC = () => {
  const [Teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        setError("Failed to fetch Teams");
        toast.error("Failed to fetch Teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTeam(id);
      setTeams(Teams.filter((Team) => Team.id !== id));
      toast.success("Team deleted successfully");
    } catch (err) {
      toast.error("Failed to delete Team");
    }
  };

  const handleButtonClick = (id: number) => {
    navigate(`/dashboard/edit-Team/${id}`);
  };

  const handleAddTeamClick = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Team List</h1>
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={handleAddTeamClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Team
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Teams.map((Team) => (
            <tr
              key={Team.id}
              className="hover:bg-gray-600 transition duration-200 border-b border-gray-600"
            >
              <td className="py-4 px-6 text-sm text-gray-300">
                {Team.id}
              </td>
              <td className="py-4 px-6 text-sm text-gray-300">
                {Team.name}
              </td>
              <td className="py-4 px-6 text-sm flex space-x-4">
                <button
                  onClick={() => handleButtonClick(Team.id)}
                  className="text-blue-400 hover:text-blue-500 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(Team.id)}
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
      <TeamModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        TeamId={selectedTeam ?? 0}
      />
    </div>
  );
};

export default TeamList;
