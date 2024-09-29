import { ReactNode } from "react";
import { IconType } from "react-icons";

interface IProps {
  role: string;
  icon: IconType;
  color: string;
  children?: ReactNode;
}

const PageAccessTemplate = ({ role, icon: Icon, color, children }: IProps) => {
  return (
    <div className="pageTemplate3 bg-white border-l-4 border-t-4" style={{ borderColor: color }}>
      <section className="w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 p-6">
        <div>
          <Icon className="text-6xl md:text-8xl" style={{ color: color }} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800">{`This is ${role} Page`}</h2>
          <h2 className="text-md text-gray-700">
            {`You must have ${role} access to see this page`}
          </h2>
        </div>
      </section>
      <section className="p-6">
        {children}
      </section>
    </div>
  );
};

export default PageAccessTemplate;
