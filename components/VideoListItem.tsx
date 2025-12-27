import React, { useState } from 'react';
import type { YouTubeVideo, VideoAnalysis } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { VideoAnalysisDetail } from './VideoAnalysisDetail';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';

interface VideoListItemProps {
  video: YouTubeVideo;
  index: number;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysis: VideoAnalysis | null | undefined;
}

export const VideoListItem: React.FC<VideoListItemProps> = ({ video, index, onAnalyze, isAnalyzing, analysis }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const canAnalyze = index < 10;
  const descriptionNeedsTruncation = video.description && video.description.length > 250;

  return (
    <div className="bg-gray-800/70 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 md:flex-shrink-0">
           <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block relative group">
             <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                 <svg className="w-16 h-16 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
              </div>
           </a>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-100 mb-2" title={video.title}>
            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
             {video.title}
            </a>
          </h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-1">{video.channelTitle}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <EyeIcon className="w-4 h-4 mr-1.5" />
            <span>{video.viewCount} views</span>
          </div>
          
          <div className="mb-4">
            <p className={`text-gray-400 text-sm whitespace-pre-wrap leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
              {video.description || "No description available."}
            </p>
            {descriptionNeedsTruncation && (
              <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-red-400 hover:text-red-300 text-sm font-semibold mt-2"
              >
                {isDescriptionExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          
          {video.tags && video.tags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-300 mb-2">Video Tags</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags.slice(0, 15).map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-700/80 text-gray-300 text-xs font-mono rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex-grow"></div>

          {canAnalyze && (
             <div className="mt-auto pt-4">
                <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing || !!analysis}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    {isAnalyzing ? 'Analyzing...' : (analysis ? 'Analysis Complete' : 'Analyze SEO with AI')}
                </button>
            </div>
          )}
        </div>
      </div>
       {isAnalyzing && (
        <div className="p-6 border-t border-gray-700/50 flex items-center justify-center">
          <Loader/>
          <p className="ml-4 text-gray-400">Gemini AI is analyzing the video...</p>
        </div>
      )}
      {analysis === null && (
        <div className="p-6 border-t border-gray-700/50">
          <ErrorMessage message="AI analysis failed. This could be due to a missing/invalid Gemini API key or a network issue."/>
        </div>
      )}
      {analysis && (
        <div className="p-6 border-t border-dashed border-gray-700">
           <VideoAnalysisDetail analysis={analysis} />
        </div>
      )}
    </div>
  );
};
