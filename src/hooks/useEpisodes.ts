import { useState } from 'react';
import { fetchEpisodes } from '../api/episodesApi';
import type { Episode, ApiResponse } from '../interfaces/episode';

interface UseEpisodesReturn {
  episodes: Episode[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadEpisodes: (query: string, page: number) => Promise<void>;
  currentPage: number;
}

export const useEpisodes = (): UseEpisodesReturn => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadEpisodes = async (query: string, page: number): Promise<void> => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params: { page: number; name?: string } = { page };
      if (query) params.name = query;
      
      const response = await fetchEpisodes(params);
      
      if (!response.ok) {
        throw new Error('Failed to fetch episodes');
      }
      
      const data: ApiResponse = await response.json();
      const newEpisodes = data.results.slice(0, 12);
      
      setEpisodes(prev => 
        page === 1 ? newEpisodes : [...prev, ...newEpisodes]
      );
      setHasMore(data.info.next !== null);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load episodes');
      setHasMore(false);
      if (page === 1) setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    episodes, 
    loading, 
    hasMore, 
    error, 
    loadEpisodes, 
    currentPage 
  };
};