import React from "react";

interface InputValueProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputValue: React.FC<InputValueProps> = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="text-text-light font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default InputValue;
