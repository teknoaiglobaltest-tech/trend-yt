import type { YouTubeVideo, YouTubeApiResponse, ApiVideoItem, YouTubeCategory, YouTubeCategoriesApiResponse } from '../types';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const formatViewCount = (countStr: string): string => {
  const count = parseInt(countStr, 10);
  if (count >= 1_000_000_000) {
    return (count / 1_000_000_000).toFixed(1) + 'B';
  }
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + 'K';
  }
  return count.toString();
};

const transformApiData = (items: ApiVideoItem[]): YouTubeVideo[] => {
  return items.map(item => ({
    id: item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    // FIX: Corrected the path to the high-resolution thumbnail URL.
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
    viewCount: formatViewCount(item.statistics.viewCount),
    description: item.snippet.description || '',
    tags: item.snippet.tags || [],
  }));
};

export const fetchTrendingVideos = async (apiKey: string, regionCode: string, categoryId: string): Promise<YouTubeVideo[]> => {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode: regionCode,
    maxResults: '24',
    key: apiKey,
  });

  if (categoryId && categoryId !== '0') {
    params.append('videoCategoryId', categoryId);
  }

  const url = `${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(`Failed to fetch videos: ${errorMessage}`);
    }

    return transformApiData(data.items || []);
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError') {
        throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

export const fetchVideoCategories = async (apiKey: string, regionCode: string): Promise<YouTubeCategory[]> => {
    const params = new URLSearchParams({
        part: 'snippet',
        regionCode: regionCode,
        key: apiKey,
    });

    const url = `${YOUTUBE_API_BASE_URL}/videoCategories?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data: YouTubeCategoriesApiResponse = await response.json();

        if (!response.ok) {
            const errorMessage = (data as any).error?.message || `HTTP error! status: ${response.status}`;
            throw new Error(`Failed to fetch categories: ${errorMessage}`);
        }

        return (data.items || [])
            .filter(item => item.snippet.assignable)
            .map(item => ({
                id: item.id,
                title: item.snippet.title
            }));
    } catch (error) {
        if (error instanceof Error && error.name === 'TypeError') {
            throw new Error('Network error while fetching categories.');
        }
        throw error;
    }
};