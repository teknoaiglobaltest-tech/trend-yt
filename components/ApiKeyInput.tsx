
import React from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
        YouTube API Key
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <KeyIcon className="h-5 w-5 text-gray-500" />
        </div>
        <input
          id="api-key"
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your API Key here"
          className="block w-full rounded-lg border-gray-600 bg-gray-700 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-150 ease-in-out"
        />
      </div>
    </div>
  );
};
