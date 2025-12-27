
import React from 'react';
import { COUNTRIES } from '../constants';
import { GlobeIcon } from './icons/GlobeIcon';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="country-selector" className="block text-sm font-medium text-gray-300 mb-2">
        Country / Region
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GlobeIcon className="h-5 w-5 text-gray-500" />
        </div>
        <select
          id="country-selector"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-lg border-gray-600 bg-gray-700 py-3 pl-10 pr-10 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-150 ease-in-out"
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code} className="bg-gray-800 text-white">
              {country.name}
            </option>
          ))}
        </select>
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
        </div>
      </div>
    </div>
  );
};
