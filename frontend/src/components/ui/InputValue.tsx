import React from "react";

interface InputValueProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputValue: React.FC<InputValueProps> = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400"
      />
    </div>
  );
};

export default InputValue;
