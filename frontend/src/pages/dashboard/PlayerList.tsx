import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { getPlayers, deletePlayer, createPlayer, getTeamByID } from '../../services/testServices';
import { CUPlayerDto, PlayerDto } from '../../types/testTypes';
import PlayerCreateModal from '../../components/modals/PlayerCreateModal';


const PlayerList: React.FC = () => {
    const [Players, setPlayers] = useState<PlayerDto[]>([]);
    const [Teams, setTeams] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getPlayers();
                setPlayers(data);
                const TeamIds = Array.from(new Set(data.map(Player => Player.TeamId).filter(id => id > 0)));
                const TeamPromises = TeamIds.map(id => getTeamByID(id));
                const TeamData = await Promise.all(TeamPromises);
                const TeamMap: Record<number, string> = {};
                TeamData.forEach(Team => {
                    if (Team) {
                        TeamMap[Team.id] = Team.name;
                    }
                });
                setTeams(TeamMap);
            } catch (err) {
                setError('Failed to fetch Players');
                toast.error('Failed to fetch Players');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deletePlayer(id);
            setPlayers(Players.filter(Player => Player.id !== id));
            toast.success('Player deleted successfully');
        } catch (err) {
            toast.error('Failed to delete Player');
        }
    };

    const handleButtonClick = (id: number) => {
        navigate(`/dashboard/edit-Player/${id}`);
    };

    const handleCreate = async (playerDto: CUPlayerDto) => {
        try {
          await createPlayer(playerDto);
          toast.success("Room created successfully");
          setModalOpen(false);
        } catch (err) {
          toast.error("Failed to create room");
        }
      };


    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col items-start justify-start p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen w-full">
          <h1 className="text-3xl font-bold text-white mb-8">Player List</h1>
          <button
              onClick={() => {
                setModalOpen(true);
              }}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Room
            </button>
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">ID</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Name</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Team</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Available</th>
                <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Players.map(Player => (
                <tr key={Player.id} className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">{Player.id}</td>
                  <td className="py-4 px-6 text-white">{`${Player.Name}`}</td>
                  <td className="py-4 px-6 text-white">{Player.number}</td>
                  <td className="py-4 px-6 text-white">{Player.BirthYear}</td>
                  <td className="py-4 px-6 text-white">
                    {Player.TeamId > 0 ? Teams[Player.TeamId] : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleButtonClick(Player.id)}
                      className="text-blue-400 hover:underline mr-4 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(Player.id)}
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
              onCreate={handleCreate}
            />
          )}
          
        </div>
      );
      
};

export default PlayerList;




