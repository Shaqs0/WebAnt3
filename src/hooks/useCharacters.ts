import { useState, useEffect } from 'react';
import { fetchCharacters } from '../api/characterApi';
import type { Character } from '../interfaces/character';

export const useCharacters = (filters: Record<string, string>, page: number) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadCharacters = async () => {
      if (loading) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value.trim() !== '')
        );
        
        const params = { ...activeFilters, page: page.toString() };
        const data = await fetchCharacters(params);
        
        setCharacters(prev => {
          if (page === 1) return data.results;
          
          const existingIds = new Set(prev.map(c => c.id));
          const newCharacters = data.results.filter(c => !existingIds.has(c.id));
          return [...prev, ...newCharacters];
        });
        
        setHasMore(data.info.next !== null);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to load characters');
          setCharacters([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCharacters();
    
    return () => controller.abort();
  }, [filters, page]);

  useEffect(() => {
    setCharacters([]);
    setHasMore(true);
    setError(null);
  }, [filters]);

  return { characters, loading, hasMore, error };
};