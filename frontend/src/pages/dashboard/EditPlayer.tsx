import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerByID, getTeams, updatePlayer } from "../../services/testServices"; // Assuming you have this service
import { CUPlayerDto, TeamDto } from "../../types/testTypes";
import { toast } from "react-hot-toast";

const PlayerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the player ID from URL params
  const navigate = useNavigate();
  const [player, setPlayer] = useState<CUPlayerDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teams, setTeams] = useState<TeamDto[]>([]);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await getPlayerByID(Number(id)); // Assuming this service fetches player by ID
        setPlayer(data);
      } catch (err) {
        toast.error("Failed to fetch player details");
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const teamData: TeamDto[] = await getTeams();
        console.log("Fetched teams:", teamData);
        setTeams(teamData);
      } catch (err) {
        toast.error('Failed to fetch Teams');
      }
    };

    fetchPlayer();
    fetchTeams();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player) return;

    try {
      await updatePlayer(Number(id), player); // Assuming this updates the player
      toast.success("Player updated successfully");
      navigate("/dashboard/player-list"); // Redirect after successful update
    } catch (err) {
      toast.error("Failed to update player");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!player) return <div className="text-center">Player not found</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Edit player Information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={player.Name}
                onChange={(e) => setPlayer({ ...player, Name: e.target.value })}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="Number" className="block text-sm font-medium text-gray-300 mb-1">
                Number
              </label>
              <input
                type="number"
                name="Number"
                id="Number"
                value={player.Number || ""} // Ensure value is a string for controlled input
                onChange={(e) => {
                const newValue = e.target.value;
                setPlayer({ ...player, Number: newValue ? Number(newValue) : 0 }); // Convert to number or set to 0 if empty
                }}
                placeholder="Enter number"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="BirthYear" className="block text-sm font-medium text-gray-300 mb-1">
                BirthYear
              </label>
              <input
                name="BirthYear"
                id="BirthYear"
                value={player.BirthYear || ""} // Ensure value is a string for controlled input
                onChange={(e) => {
                const newValue = e.target.value;
                setPlayer({ ...player, BirthYear: newValue ? Number(newValue) : 0 }); // Convert to number or set to 0 if empty
                }}
                placeholder="Enter BirthYear"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="Team" className="block text-sm font-medium text-gray-300 mb-1">
                Team
              </label>
              <select
                name="teamId"
                id="teamId"
                value={player.TeamId|| ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setPlayer({ ...player, TeamId: newValue ? Number(newValue) : 0 }); // Convert to number or set to 0 if empty
                  }}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Team</option>
                {teams.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
  
          </div>
  
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerEdit;
