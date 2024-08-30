import { CiLogin, CiUser } from "react-icons/ci";
import useAuth from "../../hooks/useAuth.hook";
import Button from "../general/Button";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";
import { TbLogs } from "react-icons/tb";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { GrBladesVertical, GrUserManager } from "react-icons/gr";
import { FaTruckLoading, FaUserCheck } from "react-icons/fa";
import { GiHeatHaze, GiMaterialsScience, GiMetalPlate } from "react-icons/gi";
import { GoProjectRoadmap, GoProjectSymlink } from "react-icons/go";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (url: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    navigate(url);
  };

  return (
    <div className="shrink-0 bg-[#01204E] w-60 p-2 min-h-[calc(100vh-48px)] flex flex-col items-stretch gap-8">
      <div className="self-center flex flex-col items-center">
        <CiUser className="w-10 h-10 text-white" />
        <h4 className="text-white">
          {user?.firstName} {user?.lastName}
        </h4>
      </div>

      <Button
        label="Users Management"
        onClick={() => handleClick(PATH_DASHBOARD.usersManagement)}
        type="button"
        variant="secondary"
        icon={<CiUser className="w-5 h-5 text-white mr-2" />}
      />
      <Button
        label="All Logs"
        onClick={() => handleClick(PATH_DASHBOARD.systemLogs)}
        type="button"
        variant="secondary"
        icon={<TbLogs className="w-5 h-5 text-white mr-2" />}
      />
      <Button
        label="My Logs"
        onClick={() => handleClick(PATH_DASHBOARD.myLogs)}
        type="button"
        variant="secondary"
        icon={<CiLogin className="w-5 h-5 text-white mr-2" />}
      />
      <hr />
      <Button
        label="Admin Page"
        onClick={() => handleClick(PATH_DASHBOARD.admin)}
        type="button"
        variant="secondary"
        icon={
          <MdOutlineAdminPanelSettings className="w-5 h-5 text-white mr-2" />
        }
      />
      <Button
        label="User Page"
        onClick={() => handleClick(PATH_DASHBOARD.user)}
        type="button"
        variant="secondary"
        icon={
          <MdOutlineAdminPanelSettings className="w-5 h-5 text-white mr-2" />
        }
      />
      <hr />
    </div>
  );
};

export default Sidebar;
