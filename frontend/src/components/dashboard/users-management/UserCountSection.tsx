import { IAuthUser, RolesEnum } from "../../../types/auth.types";
import UserCountCard from "./UserCountCard";
import { FaUser, FaUserCog, FaUserShield, FaUserTie } from "react-icons/fa";

interface IProps {
  usersList: IAuthUser[];
}

const UserCountSection = ({ usersList }: IProps) => {
  let patients = 0;
  let admin = 0;
  let nurses = 0;
  let doctors = 0;

  usersList.forEach((item) => {
    if (item.roles.includes(RolesEnum.PATIENT)) {
      patients++;
    } else if (item.roles.includes(RolesEnum.ADMIN)) {
      admin++;
    } else if (item.roles.includes(RolesEnum.NURSE)) {
      nurses++;
    } else if (item.roles.includes(RolesEnum.DOCTOR)) {
      doctors++;
    }
  });

  const userCountData = [
    { count: patients, role: RolesEnum.PATIENT, icon: FaUserCog, color: "#4A90E2" },
    { count: admin, role: RolesEnum.ADMIN, icon: FaUserShield, color: "#56CCF2" }, 
    { count: nurses, role: RolesEnum.NURSE, icon: FaUserTie, color: "#81C784" }, 
    { count: doctors, role: RolesEnum.DOCTOR, icon: FaUser, color: "#A0AEC0" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-4">
      {userCountData.map((item, index) => (
        <UserCountCard
          key={index}
          count={item.count}
          role={item.role}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default UserCountSection;
