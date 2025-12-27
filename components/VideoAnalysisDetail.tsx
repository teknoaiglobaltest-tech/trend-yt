import React from 'react';
import type { VideoAnalysis } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface VideoAnalysisDetailProps {
  analysis: VideoAnalysis;
}

export const VideoAnalysisDetail: React.FC<VideoAnalysisDetailProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 text-gray-300 animate-fade-in">
      <div>
        <h4 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          AI Content Summary
        </h4>
        <p className="text-base whitespace-pre-wrap leading-relaxed font-light">
          {analysis.summary}
        </p>
      </div>
      
      <div>
        <h4 className="text-xl font-bold text-red-400 mb-3">SEO Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.seoKeywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-gray-700 text-cyan-300 text-sm font-medium rounded-full">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-bold text-red-400 mb-3">Hashtags</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.hashtags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-700 text-purple-300 text-sm font-mono rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);