import React, { useState, useCallback, useEffect } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { CategorySelector } from './components/CategorySelector';
import { VideoList } from './components/VideoList';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { YouTubeIcon } from './components/icons/YouTubeIcon';
import { fetchTrendingVideos, fetchVideoCategories } from './services/youtubeService';
import { analyzeVideoContent } from './services/geminiService';
import type { YouTubeVideo, YouTubeCategory, VideoAnalysis } from './types';

const App: React.FC = () => {
  // Hardcoded API Key for immediate usage
  const [apiKey] = useState<string>('AIzaSyBRJF0FOs7PvZt1ExD1mvX3RBrQGBKh36Y');
  const [regionCode, setRegionCode] = useState<string>('US');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [categories, setCategories] = useState<YouTubeCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('0');
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);

  // State baru untuk analisis AI
  const [analysisCache, setAnalysisCache] = useState<Record<string, VideoAnalysis | null>>({});
  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey || !regionCode) {
      setCategories([]);
      setSelectedCategoryId('0');
      return;
    }

    const getCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const fetchedCategories = await fetchVideoCategories(apiKey, regionCode);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch video categories:', err);
        setCategories([]);
      } finally {
        setSelectedCategoryId('0');
        setIsCategoriesLoading(false);
      }
    };

    getCategories();
  }, [apiKey, regionCode]);

  const handleFetchVideos = useCallback(async () => {
    if (!apiKey) {
      setError('YouTube API Key is required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setAnalysisCache({}); // Reset cache pada pencarian baru

    try {
      const fetchedVideos = await fetchTrendingVideos(apiKey, regionCode, selectedCategoryId);
      setVideos(fetchedVideos);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, regionCode, selectedCategoryId]);

  // Auto-fetch videos on mount (immediately usable)
  useEffect(() => {
    if (apiKey && !hasSearched && !isLoading) {
      handleFetchVideos();
    }
  }, [apiKey, hasSearched, isLoading, handleFetchVideos]);

  const handleAnalyzeVideo = useCallback(async (video: YouTubeVideo) => {
    if (analyzingVideoId === video.id || analysisCache[video.id]) return;

    setAnalyzingVideoId(video.id);
    setError(null); // Hapus error utama saat mencoba analisis
    try {
      const analysis = await analyzeVideoContent(video.title, video.description);
      setAnalysisCache(prev => ({ ...prev, [video.id]: analysis }));
    } catch (err) {
      console.error('Failed to analyze video:', err);
      // Menampilkan pesan error spesifik analisis di komponen video
      setAnalysisCache(prev => ({ ...prev, [video.id]: null })); 
      if (err instanceof Error) {
        setError(`AI analysis failed for "${video.title}": ${err.message}. Please check your Gemini API key setup.`);
      } else {
        setError(`An unknown error occurred during AI analysis for "${video.title}".`);
      }
    } finally {
      setAnalyzingVideoId(null);
    }
  }, [analyzingVideoId, analysisCache]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <div className="container mx-auto px-4 py-8">
        
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-4 mb-2">
            <YouTubeIcon className="h-16 w-16 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-red-500 to-red-700">
              TEKNO YouTube Trends Finder
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Discover what's trending around the world.</p>
        </header>

        <main>
          <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl shadow-red-500/10 border border-gray-700 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <CountrySelector value={regionCode} onChange={setRegionCode} />
              <CategorySelector
                value={selectedCategoryId}
                onChange={setSelectedCategoryId}
                categories={categories}
                isLoading={isCategoriesLoading}
                disabled={!apiKey}
              />
            </div>
            <button
              onClick={handleFetchVideos}
              disabled={isLoading || !apiKey}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
              {isLoading ? 'Searching...' : 'Find Trending Videos'}
            </button>
          </div>

          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          
          {!isLoading && !error && videos.length > 0 && (
            <VideoList 
              videos={videos}
              onAnalyzeVideo={handleAnalyzeVideo}
              analysisCache={analysisCache}
              analyzingVideoId={analyzingVideoId}
            />
          )}

          {!isLoading && !error && hasSearched && videos.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-300">No videos found.</h2>
              <p className="text-gray-500 mt-2">Try a different region, category or check your API key permissions.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;