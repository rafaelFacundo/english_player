import React from "react";
import "./index.css";

type ButtonProps = {
  icon: React.ReactNode | string;
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ icon, className, onClick }) => {
  return (
    <button className={className} id="button" onClick={onClick}>
      {icon}
    </button>
  );
};

export default Button;
