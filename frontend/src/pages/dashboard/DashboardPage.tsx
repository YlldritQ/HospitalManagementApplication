import NursePage from "./NursePage";
import DoctorPage from "./DoctorPage";
import AdminPage from "./AdminPage";
import useAuth from "../../hooks/useAuth.hook";


const DashboardPage: React.FC = () => {

  const { user: loggedInUser } = useAuth();
  const roles = loggedInUser?.roles;
  return (
    <div >
      {roles?.includes("Admin") && (
        <AdminPage></AdminPage>
      )}
      {roles?.includes("Doctor") && (
        <DoctorPage></DoctorPage>
      )}
      {roles?.includes("Nurse") && (
        <NursePage></NursePage>
      )}
    </div>
  );
};

export default DashboardPage;
