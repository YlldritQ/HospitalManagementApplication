import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPlayerByID, getTeams, updatePlayer } from '../../services/testServices';
import { CUPlayerDto, TeamDto, PlayerDto } from '../../types/testTypes';

const EditPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [Player, setPlayer] = useState<CUPlayerDto>({
    Name: '',
    number:0,
    BirthYear: 0,
    TeamId:0,
  });

  const [Teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const departmentData: TeamDto[] = await getTeams();
        setTeams(departmentData);
      } catch (err) {
        toast.error('Failed to fetch Teams');
      }
    };

    fetchTeams();

    if (id) {
      const fetchPlayer = async () => {
        try {
          const data: PlayerDto | null = await getPlayerByID(Number(id));
          if (data) {
            setPlayer({
              Name: data.Name,
              number: data.number,
              BirthYear: data.BirthYear,
              TeamId: data.TeamId,
            });
          } else {
            setError('Player not found');
          }
        } catch (err) {
          setError('Failed to fetch Player details');
        } finally {
          setLoading(false);
        }
      };

      fetchPlayer();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setPlayer((prevState) => ({
        ...prevState,
        [name]: (event.target as HTMLInputElement).checked,
      }));
    } else if (type === 'date') {
      setPlayer((prevState) => ({
        ...prevState,
        [name]: new Date(value),
      }));
    } else {
      setPlayer((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedPlayer: CUPlayerDto = {
      ...Player,
      
    };

    try {
      if (id) {
        console.log(updatePlayer);
        await updatePlayer(Number(id), updatedPlayer);
          toast.success(`Player updated successfully`);
        }
      
      navigate('/dashboard/Player-list');
    } catch (err) {
      toast.error('Failed to save Player');
    }
  };

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-5xl bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Edit Player Information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={Player.Name}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
                      
          </div>

  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="number"
                name="dateOfBirth"
                id="dateOfBirth"
                value={Player.BirthYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  

  
          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300 mb-1">
              Number
            </label>
            <input
              type="text"
              name="qualifications"
              id="qualifications"
              value={Player.number}
              onChange={handleChange}
              placeholder="Enter qualifications"
              className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-300 mb-1">
                Team
              </label>
              <select
                name="teamId"
                id="teamId"
                value={Player.TeamId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Team</option>
                {Teams.map((dept) => (
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
              Save Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default EditPlayer;
