import { Line } from "react-chartjs-2";
import { IAuthUser, RolesEnum } from "../../../types/auth.types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface IProps {
  usersList: IAuthUser[];
}

const UserChartSection = ({ usersList }: IProps) => {
  const chartLabels = [
    RolesEnum.PATIENT,
    RolesEnum.ADMIN,
    RolesEnum.NURSE,
    RolesEnum.DOCTOR,
  ];
  const chartValues = [];

  const ownersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.PATIENT)
  ).length;
  chartValues.push(ownersCount);
  
  const adminsCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.ADMIN)
  ).length;
  chartValues.push(adminsCount);

  const managersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.NURSE)
  ).length;
  chartValues.push(managersCount);

  const usersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.DOCTOR)
  ).length;
  chartValues.push(usersCount);

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        ticks: { stepSize: 5 },
        grid: { color: '#E2E8F0' }, // Light grey grid lines for better visibility
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "User Count",
        data: chartValues,
        borderColor: "#4A90E2",  // Primary blue for the line
        backgroundColor: "rgba(86, 204, 242, 0.4)",  // Light teal with transparency for the fill
        pointBorderColor: "#81C784",  // Soft green for the points
        tension: 0.4,  // Soft curve for a modern feel
      },
    ],
  };

  return (
    <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-blue-500 to-blue-300 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-white mb-4">Users Chart</h1>
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default UserChartSection;
