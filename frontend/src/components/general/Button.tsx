import { ReactNode } from "react";

interface IProps {
  variant: "primary" | "secondary" | "danger" | "light";
  type: "submit" | "button";
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

const Button = ({
  variant,
  type,
  label,
  onClick,
  loading,
  disabled,
  icon,
}: IProps) => {
  const baseClasses =
    "flex items-center justify-center outline-none duration-300 h-10 text-md font-medium px-6 rounded-full transition-all focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75";
    
  const variants = {
    primary:
      "text-white bg-gray-900 hover:bg-gray-700 focus:ring-gray-500",
    secondary:
      "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-300",
    danger:
      "text-white bg-red-600 hover:bg-red-500 focus:ring-red-500",
    light:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200",
  };

  const className = `${baseClasses} ${variants[variant]} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  const loadingIcon = (
    <div className="w-5 h-5 rounded-full animate-spin border-2 border-transparent border-t-white"></div>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled || loading}
    >
      {icon && icon}
      {loading ? loadingIcon : label}
    </button>
  );
};

export default Button;
