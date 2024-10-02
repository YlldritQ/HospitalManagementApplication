import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  getPlayers,
  deletePlayer,
  createPlayer,
  getTeams,
} from "../../services/testServices";
import { CUPlayerDto, PlayerDto, TeamDto } from "../../types/testTypes";
import PlayerCreateModal from "../../components/modals/PlayerCreateModal";

const PlayerList: React.FC = () => {
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<PlayerDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State for modal visibility

  useEffect(() => {
    const fetchPlayers = async () => {
      
      try {
        const playerData: PlayerDto[] = await getPlayers();
        console.log(playerData); 
        setPlayers(playerData);
      } catch (err) {
        toast.error('Failed to fetch players');
        setError('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const teamData: TeamDto[] = await getTeams();
        setTeams(teamData);
      } catch (err) {
        toast.error('Failed to fetch Teams');
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deletePlayer(id);
      setPlayers(players.filter((player) => player.id !== id)); // Update the players state
      toast.success("Player deleted successfully");
    } catch (err) {
      toast.error("Failed to delete player");
    }
  };

  const handleButtonClick = (id: number) => {
    navigate(`/dashboard/edit-player/${id}`);
  };

  const handleCreate = async (playerDto: CUPlayerDto) => {
    try {
      await createPlayer(playerDto);
      toast.success("Player created successfully");
      setModalOpen(false);
      // Optionally, fetch players again to update the list
      const playerData: PlayerDto[] = await getPlayers();
      setPlayers(playerData);
    } catch (err) {
      toast.error("Failed to create player");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
      <h1 className="text-3xl font-bold text-white mb-8">Player List</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add New Player
      </button>
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Number</th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Birth Year</th>
            <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
  {players.map((player) => (
    <tr key={player.id} className="border-b border-gray-700">
      <td className="py-4 px-6 text-white">{player.id}</td>
      <td className="py-4 px-6 text-white">{player.Name}</td> {/* Use player.Name */}
      <td className="py-4 px-6 text-white">{player.Number}</td> {/* Use player.Number */}
      <td className="py-4 px-6 text-white">{player.BirthYear}</td> {/* Use player.BirthYear */}
      <td className="py-4 px-6">
        <button
          onClick={() => handleButtonClick(player.id)}
          className="text-blue-400 hover:underline mr-4 transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(player.id)}
          className="text-red-400 hover:underline mr-4 transition duration-200"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>


      </table>
      <Toaster />
      {modalOpen && (
        <PlayerCreateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}  // Ensure handleCreate is defined and passed correctly
      />
      )}
    </div>
  );
};

export default PlayerList;
