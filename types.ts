export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  viewCount: string;
  description: string;
  tags: string[];
}

export interface VideoAnalysis {
  summary: string;
  seoKeywords: string[];
  hashtags: string[];
}

export interface YouTubeCategory {
  id: string;
  title: string;
}

export interface YouTubeApiResponse {
  items: ApiVideoItem[];
}

export interface YouTubeCategoriesApiResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      assignable: boolean;
    };
  }[];
}

export interface ApiVideoItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    tags: string[];
    thumbnails: {
      medium: {
        url: string;
      };
      high?: {
        url: string;
      }
    };
  };
  statistics: {
    viewCount: string;
  };
}