import React from 'react';
import type { YouTubeCategory } from '../types';
import { TagIcon } from './icons/TagIcon';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  categories: YouTubeCategory[];
  isLoading: boolean;
  disabled: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, categories, isLoading, disabled }) => {
  return (
    <div>
      <label htmlFor="category-selector" className="block text-sm font-medium text-gray-300 mb-2">
        Niche / Category
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <TagIcon className="h-5 w-5 text-gray-500" />
        </div>
        <select
          id="category-selector"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
          className="block w-full appearance-none rounded-lg border-gray-600 bg-gray-700 py-3 pl-10 pr-10 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="0" className="bg-gray-800 text-white">
            {isLoading ? 'Loading...' : 'All Categories'}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-gray-800 text-white">
              {category.title}
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