
import { SiSharp } from "react-icons/si";


const Header = () => {

  return (
    <header className="flex items-center justify-between p-4 bg-blue-800">
      <div className="flex items-center text-white text-2xl font-bold">
        <span
          className="font-black"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          Patient
        </span>
        <SiSharp className="ml-2" />
      </div>
    </header>
  );
};

export default Header;
