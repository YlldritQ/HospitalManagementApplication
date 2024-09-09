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
      },
    },
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "count",
        data: chartValues,
        borderColor: "#754eb475",
        backgroundColor: "#754eb4",
        pointBorderColor: "transparent",
        tension: 0.25,
      },
    ],
  };

  return (
    <div className="col-span1 lg:col-span-3 bg-white p-2 rounded-md">
      <h1 className="text-xl font-bold mb-2">Users Chart</h1>
      <Line
        options={chartOptions}
        data={chartData}
        className="bg-white p-2 rounded-md"
      />
    </div>
  );
};

export default UserChartSection;
