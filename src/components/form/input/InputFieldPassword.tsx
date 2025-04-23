'use client'

import { useState } from "react";
import Input from "@/components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "@/icons";

interface InputFieldPasswordProps {
  id?: string;
  name: string;
  defaultValue?: string;
}

const InputFieldPasword: React.FC<InputFieldPasswordProps> = ({
  id,
  name,
  defaultValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="relative">
      <Input
        name={name}
        id={id}
        type={showPassword ? "text" : "password"}
        defaultValue={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={togglePassword}
        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
      >
        {showPassword ? (
          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
        ) : (
          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
        )}
      </button>
    </div>
  )
}

export default InputFieldPasword;
