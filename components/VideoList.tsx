import React from 'react';
import type { YouTubeVideo, VideoAnalysis } from '../types';
import { VideoListItem } from './VideoListItem';

interface VideoListProps {
  videos: YouTubeVideo[];
  onAnalyzeVideo: (video: YouTubeVideo) => void;
  analysisCache: Record<string, VideoAnalysis | null>;
  analyzingVideoId: string | null;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, onAnalyzeVideo, analysisCache, analyzingVideoId }) => {
  return (
    <div className="space-y-6">
      {videos.map((video, index) => (
        <VideoListItem 
          key={video.id} 
          video={video}
          index={index}
          onAnalyze={() => onAnalyzeVideo(video)}
          analysis={analysisCache[video.id]}
          isAnalyzing={analyzingVideoId === video.id}
        />
      ))}
    </div>
  );
};